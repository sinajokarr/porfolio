"""Original soundtrack + SFX for the Antalya Smile Tour clip (60 s, 44.1 kHz stereo WAV).
Everything is synthesised from scratch — no samples, no licensing issues.
Usage: python3 audio.py out.wav
"""
import sys, wave
import numpy as np

SR = 44100
DUR = 60.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
mus = np.zeros((N, 2))   # music bus
sfx = np.zeros((N, 2))   # effects bus

BPM = 115
B = 60 / BPM             # one beat
midi = lambda n: 440 * 2 ** ((n - 69) / 12)


def put(bus, t, sig, pan=0.0, gain=1.0):
    i = int(t * SR)
    if i >= N or i + len(sig) <= 0:
        return
    if i < 0:
        sig, i = sig[-i:], 0
    sig = sig[: N - i] * gain
    bus[i:i + len(sig), 0] += sig * np.sqrt((1 - pan) / 2)
    bus[i:i + len(sig), 1] += sig * np.sqrt((1 + pan) / 2)


def tt(d):
    return np.arange(int(d * SR)) / SR


def env(x, a=0.005, decay=6.0):
    return np.minimum(1, x / a) * np.exp(-x * decay)


def lowpass(x, k):
    k = max(1, int(k))
    return np.convolve(x, np.ones(k) / k, mode='same')


# ---------- instruments ----------
def marimba(f, d=0.6):
    x = tt(d)
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * 4 * f * x) * np.exp(-x * 30)) * env(x, .002, 7)


def pluck_bass(f, d=0.4):
    x = tt(d)
    s = np.sin(2 * np.pi * f * x) + 0.5 * np.sin(2 * np.pi * 2 * f * x) * np.exp(-x * 12)
    return np.tanh(1.5 * s) * env(x, .004, 5)


def stab(fs, d=0.22):
    x = tt(d)
    s = sum(np.sign(np.sin(2 * np.pi * f * x)) * .25 + np.sin(2 * np.pi * f * x) for f in fs)
    return lowpass(s, 6) * env(x, .003, 14) / len(fs)


def pad(fs, d):
    x = tt(d)
    s = sum(np.sin(2 * np.pi * f * x) + 0.4 * np.sin(2 * np.pi * f * 1.003 * x) for f in fs) / len(fs)
    e = np.minimum(1, x / 0.6) * np.minimum(1, (d - x) / 0.6)
    return s * e


def kick():
    x = tt(0.35)
    f = 50 + 110 * np.exp(-x * 35)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(x, .001, 9)


def clap():
    x = tt(0.2)
    n = rng.uniform(-1, 1, len(x))
    n = n - lowpass(n, 8)
    return n * env(x, .001, 22)


def hat(open_=False):
    x = tt(0.12 if not open_ else 0.3)
    n = rng.uniform(-1, 1, len(x))
    n = n - lowpass(n, 3)
    return n * env(x, .001, 60 if not open_ else 14)


def noise(d):
    return rng.uniform(-1, 1, int(d * SR))


# ---------- music ----------
# Key F major: F  C  Dm  Bb  (I V vi IV)
CH = [[65, 69, 72], [64, 67, 72], [62, 65, 69], [62, 65, 70]]
ROOT = [41, 36, 38, 34]
MEL = [77, 76, 74, 72, 74, 72, 69, 72, 76, 74, 72, 74, 77, 79, 81, 79,
       77, 76, 74, 72, 74, 76, 77, 74, 72, 74, 72, 69, 70, 72, 74, 77]


def bar_of(t):
    return int(t / (4 * B))


# intro pad + sparse arpeggio
for k in range(4):
    put(mus, k * 4 * B * 0.75, pad([midi(n) for n in CH[k]], 4 * B * 0.75 + .6), gain=.22)
for i, n in enumerate([65, 69, 72, 77, 72, 69, 72, 76, 79, 84]):
    put(mus, 0.6 + i * B * .5, marimba(midi(n)), pan=(-.3 if i % 2 else .3), gain=.18)

# groove sections
def section(t0, t1, kick_on=True, hats=False, claps=False, lead_oct=0, density=1.0):
    step = B / 2
    i0 = int(np.ceil(t0 / step))
    for i in range(i0, int(t1 / step)):
        t = i * step
        beat = i % 8               # 8 eighth-notes per bar
        ch = (i // 8) % 4
        if kick_on and beat % 2 == 0:
            put(mus, t, kick(), gain=.55)
        if claps and beat in (2, 6):
            put(mus, t, clap(), gain=.22)
        if hats:
            put(mus, t, hat(beat % 2 == 1), pan=.25, gain=.07 if beat % 2 == 0 else .1)
        if beat % 2 == 1:
            put(mus, t, stab([midi(n) for n in CH[ch]]), pan=-.2, gain=.22 * density)
        if beat in (0, 3, 6):
            put(mus, t, pluck_bass(midi(ROOT[ch])), gain=.38)
        if density >= 1 or beat % 2 == 0:
            put(mus, t, marimba(midi(MEL[i % 32] + lead_oct)), pan=.2, gain=.13)

section(6.0, 14.5, kick_on=True, hats=False)
section(14.5, 31.0, kick_on=True, hats=True)
section(34.0, 50.0, kick_on=True, hats=True, claps=True, lead_oct=12)
section(50.0, 55.0, kick_on=False, hats=False, density=.6)
put(mus, 50.0, pad([midi(n) for n in CH[0]], 5.2), gain=.18)

# build-up 31-34: snare roll accelerating + riser
t = 31.0
gap = B
while t < 33.85:
    put(mus, t, clap(), gain=.12 + .18 * (t - 31) / 3)
    gap = max(B / 8, gap * 0.86)
    t += gap
x = tt(2.9)
riser = noise(2.9)
u = x / 2.9
riser = lowpass(riser, 30) * 3 * (1 - u) + (riser - lowpass(riser, 4)) * u   # filter sweeps upward
put(mus, 31.0, riser * (x / 2.9) ** 2, gain=.25)
put(mus, 31.0, pad([midi(n) for n in [62, 65, 69]], 3.0), gain=.15)

# outro jingle 55.5+
for i, n in enumerate([72, 76, 79, 84]):
    put(mus, 55.5 + i * .14, marimba(midi(n), .8), gain=.25)
put(mus, 56.1, pad([midi(n) for n in [53, 65, 69, 72, 77]], 3.6), gain=.3)
put(mus, 56.1, pluck_bass(midi(41), 1.6), gain=.4)
put(mus, 56.1, kick(), gain=.5)

# ---------- SFX ----------
def whoosh(d=0.6):
    x = tt(d)
    n = noise(d)
    out = np.zeros_like(n)
    # sweep low->high->low with a moving-average width that changes
    for a, b in [(0, .5), (.5, 1)]:
        i0, i1 = int(a * len(n)), int(b * len(n))
        k = 30 if a == 0 else 10
        out[i0:i1] = (n - lowpass(n, k))[i0:i1] if a else lowpass(n, 6)[i0:i1]
    return out * np.sin(np.pi * x / d) ** 2


def boing(t0, f0=260):
    x = tt(.4)
    f = f0 + 160 * np.sin(x * 45) * np.exp(-x * 7)
    put(sfx, t0, np.sin(2 * np.pi * np.cumsum(f) / SR) * env(x, .002, 8), gain=.3)


def ding(t0, n=88, g=.25, pan=0.0):
    x = tt(1.0)
    f = midi(n)
    s = (np.sin(2 * np.pi * f * x) + .5 * np.sin(2 * np.pi * 2.76 * f * x) * np.exp(-x * 6)) * env(x, .001, 4)
    put(sfx, t0, s, pan=pan, gain=g)


def thump(t0, g=.5):
    x = tt(.3)
    put(sfx, t0, np.sin(2 * np.pi * (45 + 60 * np.exp(-x * 25)) * x) * env(x, .002, 12), gain=g)
    put(sfx, t0, lowpass(noise(.3), 20) * env(x, .001, 15), gain=g * .8)


def pop(t0, g=.25):
    x = tt(.12)
    put(sfx, t0, np.sin(2 * np.pi * np.cumsum(400 + 900 * x / .12) / SR) * env(x, .001, 30), gain=g)


def shutter(t0):
    for dt in (0, .07):
        x = tt(.05)
        n = noise(.05)
        put(sfx, t0 + dt, (n - lowpass(n, 4)) * env(x, .0005, 80), gain=.35)


def sparkle(t0, count=7, g=.12):
    for j in range(count):
        ding(t0 + j * .07, n=int(rng.choice([88, 91, 93, 96, 98, 100])), g=g, pan=float(rng.uniform(-.7, .7)))


# transitions
for t in [5.75, 9.75, 14.25, 20.75, 24.25, 30.75, 37.75, 41.75, 45.75, 49.75, 54.75]:
    put(sfx, t - .05, whoosh(.6), gain=.28)

# intro
boing(2.85)
put(sfx, 3.55, whoosh(.35), gain=.15)
sparkle(3.9)

# home
thump(7.6, .35)                         # suitcase lid closes
for k in range(4):
    pop(9.05 + k * .38, .12)            # hopping footsteps

# flight: engine drone 9.6-17.2
x = tt(7.6)
eng = lowpass(noise(7.6), 60) * 3 + .25 * np.sin(2 * np.pi * 110 * x) + .15 * np.sin(2 * np.pi * 220.7 * x)
e = np.minimum(1, x / .8) * np.minimum(1, (7.6 - x) / 1.2)
put(sfx, 9.6, eng * e, gain=.22)
thump(16.8, .6)                         # touch-down
put(sfx, 16.8, lowpass(noise(1.0), 15) * np.exp(-tt(1.0) * 3), gain=.25)
ding(17.6, 81, .3); ding(17.95, 77, .3)  # airport "ding-dong"
for k in range(5):
    pop(18.4 + k * .38, .1)

# clinic
for k in range(7):
    pop(21.0 + k * .38, .1)
x = tt(.6)
put(sfx, 22.6, (lowpass(noise(.6), 12)) * np.sin(np.pi * x / .6), gain=.3)   # sliding doors
x = tt(2.0)
put(sfx, 25.8, np.sin(2 * np.pi * (600 + 300 * np.sin(np.pi * x)) * x) * .15 * np.minimum(1, x / .1) * np.minimum(1, (2 - x) / .1), gain=.6)
for k in range(8):
    put(sfx, 25.8 + k * .25, np.sin(2 * np.pi * 1800 * tt(.05)) * env(tt(.05), .001, 30), gain=.15)
for k, tk in enumerate([28.3, 28.9, 29.5]):
    ding(tk, 84 + k * 3, .25)
for k, n in enumerate([72, 76, 79]):
    ding(30.1 + k * .1, n, .18)

# transformation
x = tt(1.6)
put(sfx, 34.0, np.sin(2 * np.pi * (40 + 40 * np.exp(-x * 6)) * x) * env(x, .002, 2.5), gain=.7)  # impact boom
put(sfx, 34.0, lowpass(noise(1.0), 4) * np.exp(-tt(1.0) * 5), gain=.3)
sparkle(34.05, 12, .13)
put(sfx, 34.55, whoosh(.3), gain=.15); ding(34.95, 96, .2)
pop(35.6, .2); pop(35.8, .2)

# waterfall ambience 38-42
x = tt(4.2)
put(sfx, 37.9, lowpass(noise(4.2), 5) * np.minimum(1, x / .4) * np.minimum(1, (4.2 - x) / .4), gain=.22)
shutter(39.6); shutter(40.8)

# Kaleici: twinkle lights
for k in range(5):
    ding(42.4 + k * .7, int(rng.choice([96, 100, 103])), .06, pan=float(rng.uniform(-.6, .6)))

# sunset: waves + seagulls
x = tt(4.2)
put(sfx, 45.9, lowpass(noise(4.2), 25) * (.6 + .4 * np.sin(2 * np.pi * .5 * x)) * np.minimum(1, x / .4) * np.minimum(1, (4.2 - x) / .4), gain=.3)
for tg in (46.8, 48.3):
    for k in range(2):
        x = tt(.25)
        f = 1500 - 600 * x / .25 + 80 * np.sin(2 * np.pi * 30 * x)
        put(sfx, tg + k * .3, np.sin(2 * np.pi * np.cumsum(f) / SR) * env(x, .01, 6), pan=.4, gain=.07)

# fly home: polaroid pops
for k in range(4):
    pop(50.6 + k * .45, .22)
    put(sfx, 50.6 + k * .45, whoosh(.2), gain=.08)

# end card
sparkle(55.2, 8, .1)
boing(55.25, 300)

# ---------- mix ----------
mix = mus * 0.85 + sfx * 1.0
x = np.arange(N) / SR
mix *= np.minimum(1, x / .3)[:, None] * np.minimum(1, (DUR - x) / 1.0)[:, None]
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.4) / np.tanh(1.4) * 0.89
pcm = (mix * 32767).astype('<i2')
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('ok', pcm.shape)
