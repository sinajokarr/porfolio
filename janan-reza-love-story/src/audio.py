"""Original romantic soundtrack + SFX for "Janan & Reza" (60 s, 44.1 kHz stereo). Fully synthesised.
Usage: python3 audio.py out.wav"""
import sys, wave
import numpy as np

SR, DUR = 44100, 60.0
N = int(SR * DUR)
rng = np.random.default_rng(3)
mus = np.zeros((N, 2)); sfx = np.zeros((N, 2))
B = 60 / 96
midi = lambda n: 440 * 2 ** ((n - 69) / 12)
tt = lambda d: np.arange(int(d * SR)) / SR
env = lambda x, a=.005, k=6.0: np.minimum(1, x / a) * np.exp(-x * k)
lp = lambda x, k: np.convolve(x, np.ones(max(1, int(k))) / max(1, int(k)), mode='same')
noise = lambda d: rng.uniform(-1, 1, int(d * SR))


def put(bus, t, sig, pan=0.0, gain=1.0):
    i = int(t * SR)
    if i >= N or i + len(sig) <= 0: return
    if i < 0: sig, i = sig[-i:], 0
    sig = sig[:N - i] * gain
    bus[i:i + len(sig), 0] += sig * np.sqrt((1 - pan) / 2)
    bus[i:i + len(sig), 1] += sig * np.sqrt((1 + pan) / 2)


def musicbox(f, d=1.2):
    x = tt(d); return (np.sin(2*np.pi*f*x) + .4*np.sin(2*np.pi*3*f*x)*np.exp(-x*8) + .2*np.sin(2*np.pi*5.2*f*x)*np.exp(-x*14)) * env(x, .001, 3.2)
def uke(f, d=.7):  # Karplus-Strong plucked string
    n = int(d * SR); p = max(2, int(SR / f)); buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(0, n, p):
        seg = buf.copy(); out[i:i + p] = seg[:min(p, n - i)]; buf = .5 * (buf + np.roll(buf, 1)) * .996
    return out * env(tt(d), .002, 2.5)
def strum(fs, t, gain=.16, pan=-.2, up=False):
    for k, f in enumerate(fs[::-1] if up else fs): put(mus, t + k * .018, uke(f), pan=pan, gain=gain)
def glock(f, d=.9):
    x = tt(d); return (np.sin(2*np.pi*f*x) + .25*np.sin(2*np.pi*2.76*f*x)*np.exp(-x*10)) * env(x, .001, 4.5)
def pad(fs, d, gain=.12):
    x = tt(d); s = sum(np.sin(2*np.pi*f*x) + .5*np.sin(2*np.pi*f*1.004*x) + .2*np.sin(2*np.pi*2*f*x) for f in fs) / len(fs)
    return s * np.minimum(1, x / .8) * np.minimum(1, (d - x) / .8) * gain
def bass(f, d=.5):
    x = tt(d); return np.sin(2*np.pi*f*x) * env(x, .005, 4)
def kick():
    x = tt(.3); return np.sin(2*np.pi*np.cumsum(48 + 90*np.exp(-x*30))/SR) * env(x, .001, 10)
def shaker():
    x = tt(.08); n = noise(.08); return (n - lp(n, 3)) * env(x, .004, 50)
def bell(f, d=3.0):
    x = tt(d); parts = [(1, 1), (2.0, .6), (2.76, .4), (5.4, .25), (8.9, .12)]
    return sum(a*np.sin(2*np.pi*f*r*x)*np.exp(-x*(1.2 + r*.6)) for r, a in parts) * np.minimum(1, x / .002)
def heartbeat(t, g=.6):
    for dt, a in ((0, 1), (.18, .7)):
        x = tt(.25); put(sfx, t + dt, np.sin(2*np.pi*(42 + 30*np.exp(-x*20))*x) * env(x, .003, 14) * a, gain=g)
def pop(t, g=.2, f0=500):
    x = tt(.12); put(sfx, t, np.sin(2*np.pi*np.cumsum(f0 + 1000*x/.12)/SR) * env(x, .001, 28), gain=g)
def chime(t, n=96, g=.1, pan=0.0): put(sfx, t, glock(midi(n), 1.0), pan=pan, gain=g)
def sparkle(t, k=8, g=.08):
    for j in range(k): chime(t + j*.06, int(rng.choice([91, 93, 96, 98, 100, 103])), g, float(rng.uniform(-.7, .7)))
def whoosh(t, d=.6, g=.2):
    x = tt(d); n = noise(d); put(sfx, t, lp(n, 8) * np.sin(np.pi*x/d)**2, gain=g)
def woof(t, g=.35):
    x = tt(.22); f = 520 - 260*x/.22
    s = np.tanh(3*np.sin(2*np.pi*np.cumsum(f)/SR)) + .4*lp(noise(.22), 3)
    put(sfx, t, lp(s, 6) * np.sin(np.pi*np.minimum(1, x/.22))**.5 * np.exp(-x*6), gain=g)

# ---------- music ----------
C = {'C': [60, 64, 67], 'Am': [57, 60, 64], 'F': [53, 57, 60], 'G': [55, 59, 62], 'Em': [52, 55, 59], 'Dm': [50, 53, 57]}
ROOT = {'C': 36, 'Am': 33, 'F': 41, 'G': 43, 'Em': 40, 'Dm': 38}
PROG = ['C', 'Am', 'F', 'G']
MEL = [76, 79, 81, 79, 76, 74, 72, 74, 76, 72, 69, 72, 74, 77, 76, 74]

# intro music box 0-5
for i, n in enumerate([72, 76, 79, 84, 83, 79, 76, 79, 81, 77, 74, 79]):
    put(mus, .3 + i * B * .66, musicbox(midi(n)), pan=(.3 if i % 2 else -.3), gain=.16)
put(mus, 0, pad([midi(n) for n in [60, 64, 67, 72]], 5.2), gain=1)

def groove(t0, t1, drums=True, melody=True, oct=0, gain=1.0):
    step = B / 2
    for i in range(int(np.ceil(t0 / step)), int(t1 / step)):
        t = i * step; beat = i % 8; ch = PROG[(i // 8) % 4]
        fs = [midi(n) for n in C[ch]]
        if beat in (0, 3, 4, 6): strum(fs, t, .14 * gain, up=beat % 2 == 1)
        if beat in (0, 5): put(mus, t, bass(midi(ROOT[ch])), gain=.32 * gain)
        if drums:
            if beat in (0, 4): put(mus, t, kick(), gain=.35 * gain)
            put(mus, t, shaker(), pan=.3, gain=.05 * gain)
        if melody and beat % 2 == 0: put(mus, t, glock(midi(MEL[(i // 2) % 16] + oct)), pan=.25, gain=.1 * gain)

groove(5.0, 7.9, drums=False)
groove(9.6, 18.0, drums=True)
groove(18.0, 25.0, drums=True, oct=0)
put(mus, 25.0, pad([midi(n) for n in [53, 57, 60, 65]], 5.2), gain=1.1)
groove(25.0, 30.0, drums=False, melody=True, oct=12, gain=.8)
# Paris: gentle walk, suspense, YES
put(mus, 30.0, pad([midi(n) for n in [57, 60, 64]], 4.2), gain=1.0)
for i, n in enumerate([69, 72, 76, 79, 77, 76, 74, 72]):
    put(mus, 30.2 + i * B * .5, musicbox(midi(n)), gain=.12)
put(mus, 34.0, pad([midi(n) for n in [55, 59, 62, 65]], 1.2), gain=.6)   # held breath
for n in [48, 60, 64, 67, 72, 76]:
    put(mus, 35.0, pad([midi(n)], 5.0), gain=.9)
groove(35.0, 40.0, drums=True, oct=12, gain=1.1)
groove(40.0, 47.0, drums=True, gain=1.0)
groove(47.0, 54.0, drums=True, oct=12, gain=1.1)
put(mus, 47.0, pad([midi(n) for n in [60, 64, 67, 72]], 7.0), gain=.8)
# ending
put(mus, 54.0, pad([midi(n) for n in [53, 57, 60, 64]], 3.0), gain=1.0)
put(mus, 57.0, pad([midi(n) for n in [48, 60, 64, 67, 72]], 3.0), gain=1.1)
for i, n in enumerate([72, 76, 79, 84, 79, 76, 72]):
    put(mus, 54.3 + i * .42, musicbox(midi(n), 1.6), gain=.15)
strum([midi(n) for n in [48, 55, 60, 64, 67]], 57.0, .2)

# ---------- SFX ----------
for t in [4.4, 17.4, 29.4, 39.4, 46.4, 53.4]:
    whoosh(t, .6, .14); chime(t + .45, 96, .1)
whoosh(24.4, .6, .22)
# café
for k in range(5): pop(5.4 + k * .45, .06, 300)                    # footsteps
for k in range(3): heartbeat(8.0 + k * .6, .7)                        # love at first sight
pop(8.0, .25, 700); sparkle(8.05, 6, .07)
pop(12.2, .22); pop(13.9, .22); sparkle(14.3, 10, .09)
# seasons
for t in [18.0, 19.75, 21.5, 23.25]: chime(t + .05, 91, .12); chime(t + .15, 96, .1)
# plane
x = tt(5.4); put(sfx, 24.6, (lp(noise(5.4), 50) * 2 + .1*np.sin(2*np.pi*120*x)) * np.minimum(1, x/.8) * np.minimum(1, (5.4-x)/1.0), gain=.16)
for k in range(6): pop(25.6 + k * .5, .05, 900)
# Paris
for k in range(4): pop(30.1 + k * .4, .05, 300)
whoosh(31.9, .4, .08)
x = tt(.25); put(sfx, 33.2, lp(noise(.25), 3) * env(x, .002, 20), gain=.25)   # box creak
sparkle(33.25, 12, .1)
for k in range(2): heartbeat(34.1 + k * .5, .6)
for k, n in enumerate([84, 88, 91, 96]): chime(35.0 + k * .08, n, .14)
for k in range(10):
    tk = 35.2 + k * .42
    x = tt(.6); put(sfx, tk, lp(noise(.6), 2) * env(x, .002, 7), pan=float(rng.uniform(-.8, .8)), gain=.12)
    pop(tk - .25, .05, 300)
# Luna
for k in range(10): pop(41.0 + k * .11, .05, 600)
x = tt(.4); put(sfx, 42.1, np.sin(2*np.pi*np.cumsum(300 + 300*np.sin(x*30)*np.exp(-x*6))/SR) * env(x, .002, 6), gain=.2)
woof(42.9); woof(43.25, .3)
chime(44.6, 91, .15); chime(44.72, 96, .12)
# wedding bells & kiss
for k, n in enumerate([72, 76, 79, 84, 79]):
    put(sfx, 47.1 + k * .5, bell(midi(n)), pan=(-.3 if k % 2 else .3), gain=.09)
pop(50.0, .2, 700); sparkle(50.05, 6, .07)
# end
sparkle(55.4, 8, .06)

mix = mus * .8 + sfx
x = np.arange(N) / SR
mix *= np.minimum(1, x / .4)[:, None] * np.minimum(1, (DUR - x) / 1.2)[:, None]
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.3) / np.tanh(1.3) * .89
pcm = (mix * 32767).astype('<i2')
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
