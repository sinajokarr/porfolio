"""Subject mask with Apple Vision (on-device, the engine behind "Lift subject from background").

Requires macOS 14+ and:  pip install pyobjc-framework-Vision pyobjc-framework-Quartz
Usage:                   python cutout.py <photo> <mask-output.png>
"""

import sys

import Quartz
import Vision
from Foundation import NSURL


def main(src_path, mask_path):
    source = Quartz.CGImageSourceCreateWithURL(NSURL.fileURLWithPath_(src_path), None)
    image = Quartz.CGImageSourceCreateImageAtIndex(source, 0, None)
    if image is None:
        sys.exit("cannot read input image")

    request = Vision.VNGenerateForegroundInstanceMaskRequest.alloc().init()
    handler = Vision.VNImageRequestHandler.alloc().initWithCGImage_options_(image, {})
    ok, error = handler.performRequests_error_([request], None)
    if not ok or not request.results():
        sys.exit(f"no subject found ({error})")

    observation = request.results()[0]
    buffer, error = observation.generateScaledMaskForImageForInstances_fromRequestHandler_error_(
        observation.allInstances(), handler, None
    )
    if buffer is None:
        sys.exit(f"mask generation failed ({error})")

    mask = Quartz.CIImage.imageWithCVPixelBuffer_(buffer)
    rendered = Quartz.CIContext.contextWithOptions_(None).createCGImage_fromRect_(mask, mask.extent())
    dest = Quartz.CGImageDestinationCreateWithURL(NSURL.fileURLWithPath_(mask_path), "public.png", 1, None)
    Quartz.CGImageDestinationAddImage(dest, rendered, None)
    Quartz.CGImageDestinationFinalize(dest)
    print(f"mask {Quartz.CGImageGetWidth(rendered)}x{Quartz.CGImageGetHeight(rendered)}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
