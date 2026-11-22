"""Original score + sound design for "Chapter One: Vadi" (96 s, 44.1 kHz stereo). Fully synthesised.
Usage: python3 audio.py out.wav"""
import sys, wave
import numpy as np

SR, DUR = 44100, 96.0
N = int(SR * DUR)
rng = np.random.default_rng(11)
mus = np.zeros((N, 2)); amb = np.zeros((N, 2)); sfx = np.zeros((N, 2))
midi = lambda n: 440 * 2 ** ((n - 69) / 12)
tt = lambda d: np.arange(int(d * SR)) / SR
noise = lambda d: rng.uniform(-1, 1, int(d * SR))
lp = lambda x, k: np.convolve(x, np.ones(max(1, int(k))) / max(1, int(k)), mode='same')
BEAT = 60 / 72; BAR = 4 * BEAT


def put(bus, t, sig, pan=0.0, gain=1.0):
    i = int(t * SR)
    if i >= N or i + len(sig) <= 0: return
    if i < 0: sig, i = sig[-i:], 0
    sig = sig[:N - i] * gain
    bus[i:i + len(sig), 0] += sig * np.sqrt((1 - pan) / 2)
    bus[i:i + len(sig), 1] += sig * np.sqrt((1 + pan) / 2)


def piano(f, d=3.0, vel=1.0):
    x = tt(d); s = np.zeros_like(x)
    for k, a in [(1, 1), (2, .45), (3, .22), (4, .12), (5, .06)]:
        fk = f * k * (1 + .0004 * k * k)
        s += a * np.sin(2 * np.pi * fk * x) * np.exp(-x * (1.1 + .9 * k) * (0.6 + f / 900))
    ham = lp(noise(.02), 3) * np.exp(-tt(.02) * 200)
    s[:len(ham)] += ham * .3
    return s * np.minimum(1, x / .004) * vel


def pad(fs, d, bright=.3):
    x = tt(d); s = np.zeros_like(x)
    for f in fs:
        for det in (-.004, 0, .005):
            s += np.sin(2 * np.pi * f * (1 + det) * x + np.sin(2 * np.pi * .3 * x) * .4) + bright * np.sin(2 * np.pi * 2 * f * (1 + det) * x)
    s /= (len(fs) * 3)
    return s * np.minimum(1, x / 1.2) * np.minimum(1, (d - x) / 1.2)


def sub(f, d):
    x = tt(d); return np.sin(2 * np.pi * f * x) * np.minimum(1, x / .3) * np.minimum(1, (d - x) / .5)


def kick(g=1):
    x = tt(.5); return np.sin(2 * np.pi * np.cumsum(42 + 70 * np.exp(-x * 25)) / SR) * np.exp(-x * 7) * g


def frame_drum():
    x = tt(1.2); return (np.sin(2 * np.pi * np.cumsum(60 + 40 * np.exp(-x * 12)) / SR) * np.exp(-x * 3.5) + lp(noise(1.2), 30) * np.exp(-x * 9) * .6)


def tick(g=1):
    x = tt(.06); n = noise(.06); return (n - lp(n, 4)) * np.exp(-x * 70) * g


def chord(name):
    C = {'D': [50, 54, 57], 'Bm': [47, 50, 54], 'G': [43, 47, 50], 'A': [45, 49, 52], 'Em': [40, 43, 47], 'Asus': [45, 50, 52], 'F#m': [42, 45, 49]}
    return C[name]


# ---------- SCORE ----------
# Intro + café (0–22.5): piano motif over D Bm G A, pad enters at 4.5, soft pulse from 8.5
MOTIF = [(0, 78, 1.5), (1, 81, 1), (1.5, 83, 1), (2, 81, 2), (3, 78, 1), (3.5, 76, 1), (4, 74, 2), (6, 76, 1), (6.5, 78, 1), (7, 74, 3)]
def section_piano(t0, bars, prog, motif=True, oct=0, vel=.55, arp=True):
    for b in range(bars):
        cname = prog[b % len(prog)]; tb = t0 + b * BAR; notes = chord(cname)
        put(mus, tb, piano(midi(notes[0] - 12), 4.0, .5 * vel / .55), pan=-.1)
        if arp:
            for k, n in enumerate([notes[0], notes[1] + 12, notes[2] + 12, notes[1] + 12, notes[2] + 12, notes[0] + 24]):
                put(mus, tb + k * BEAT * .66, piano(midi(n), 2.5, .35 * vel / .55), pan=.15 * ((k % 2) * 2 - 1))
    if motif:
        for i in range(0, bars, 2):
            for (bt, n, ln) in MOTIF:
                put(mus, t0 + i * BAR + bt * BEAT, piano(midi(n + oct), 3.0, vel), pan=.05)

section_piano(0.2, 7, ['D', 'Bm', 'G', 'A'], motif=True)
put(mus, 4.5, pad([midi(n) for n in [62, 66, 69, 74]], 18.0), gain=.55)
for b in range(int((22.5 - 8.5) / BEAT)):
    t = 8.5 + b * BEAT
    if b % 2 == 0: put(mus, t, kick(.35))
    put(mus, t + BEAT / 2, tick(.08), pan=.3)
# slow-motion entrance swell 14.5
x = tt(3.0); put(mus, 14.3, pad([midi(n) for n in [57, 62, 66]], 3.0, .6) * np.linspace(0.2, 1, len(x)), gain=.5)
# heart-eyes shimmer 23.2
for k, n in enumerate([86, 90, 93, 98]): put(mus, 23.2 + k * .09, piano(midi(n), 2.0, .3), pan=(k - 1.5) * .3)

# Fantasy (25–35): Bm drone, choir-like pad, frame drum, horn swell
put(mus, 25.0, sub(midi(35), 10.5), gain=.5)
put(mus, 25.0, pad([midi(n) for n in [59, 62, 66, 71]], 10.6, .1), gain=.75)
put(mus, 29.0, pad([midi(n) for n in [55, 59, 62, 67]], 6.5, .5), gain=.45)
for k in range(7): put(mus, 26.5 + k * BEAT * 2, frame_drum(), gain=.45)
x = tt(4.0); horn = sum(np.sin(2 * np.pi * midi(n) * x) + .5 * np.sin(4 * np.pi * midi(n) * x) for n in [54, 61]) * np.minimum(1, x / 1.5) * np.minimum(1, (4 - x) / 1) / 3
put(mus, 30.5, lp(horn, 6), gain=.35)
for i, n in enumerate([71, 74, 78, 76, 74, 71]): put(mus, 31.0 + i * BEAT, piano(midi(n), 3.5, .45))
# reality (35–41): sudden thinner texture
put(mus, 35.0, pad([midi(n) for n in [62, 66, 69]], 2.8, .2), gain=.4)
for i, n in enumerate([78, 76, 74]): put(mus, 35.2 + i * BEAT, piano(midi(n), 2.5, .4))
put(mus, 38.4, pad([midi(n) for n in [62, 69, 74]], 2.8, .2), gain=.3)
# Dusk + car (41–50)
section_piano(41.0, 3, ['G', 'D', 'A'], motif=False, vel=.45)
put(mus, 41.0, pad([midi(n) for n in [55, 59, 62, 67]], 9.0, .3), gain=.5)
put(mus, 45.0, sub(midi(38), 5.0), gain=.35)
# Home + Yuna (50–63): lighter, playful
section_piano(50.0, 4, ['G', 'D', 'Em', 'A'], motif=True, oct=0, vel=.5)
for b in range(int(13 / (BEAT / 2))):
    put(mus, 50.0 + b * BEAT / 2, tick(.06 if b % 2 else .1), pan=.4)
put(mus, 57.0, pad([midi(n) for n in [62, 66, 69, 74]], 6.0, .4), gain=.45)
put(mus, 60.4, pad([midi(n) for n in [57, 62, 66]], 1.4, .8), gain=.5)   # flashback warmth
# Night (63–89): sparse piano, warm sub, soft pulse
put(mus, 63.0, pad([midi(n) for n in [59, 62, 66]], 26.0, .15), gain=.55)
put(mus, 63.0, sub(midi(35), 26.0), gain=.3)
for i, (bt, n) in enumerate([(0, 74), (2, 78), (4, 76), (6, 71), (9, 74), (11, 78), (13, 81), (15, 79), (18, 78), (20, 74), (22, 76), (24, 73)]):
    put(mus, 63.3 + bt * 1.0, piano(midi(n), 3.5, .42), pan=.1)
for b in range(int(26 / (BEAT * 2))): put(mus, 63.0 + b * BEAT * 2, kick(.22))
for k, n in enumerate([83, 86, 90]): put(mus, 69.5 + k * .12, piano(midi(n), 2.0, .25))   # notification sparkle
section_piano(83.0, 2, ['G', 'D'], motif=False, vel=.5)
put(mus, 86.2, pad([midi(n) for n in [62, 66, 69, 74, 78]], 3.0, .5), gain=.5)   # both smile
# Finale (89–96): bloom, then suspended (unresolved)
put(mus, 89.0, pad([midi(n) for n in [55, 59, 62, 67, 71]], 3.5, .5), gain=.65)
for i, (bt, n) in enumerate([(0, 78), (1, 81), (1.5, 83), (2, 81), (3, 78)]): put(mus, 89.2 + bt * BEAT, piano(midi(n), 3.5, .5))
put(mus, 92.5, pad([midi(n) for n in [57, 62, 64, 69, 74]], 3.5, .6), gain=.7)   # Asus4
put(mus, 92.5, piano(midi(45), 3.5, .5)); put(mus, 92.5, piano(midi(64), 3.5, .35)); put(mus, 92.5, piano(midi(74), 3.5, .35))
for k in range(6): put(mus, 93.6 + k * .18, piano(midi([86, 88, 93, 95, 98, 100][k]), 2.0, .22), pan=(k - 2.5) * .25)   # runes shimmer

# ---------- AMBIENCE ----------
def bed(t0, t1, k, g, mod=.3):
    d = t1 - t0; x = tt(d); n = lp(noise(d), k); n = n / (np.max(np.abs(n)) + 1e-9)
    e = np.minimum(1, x / .8) * np.minimum(1, (d - x) / .8) * (1 + mod * np.sin(2 * np.pi * .7 * x) * np.sin(2 * np.pi * 1.9 * x))
    put(amb, t0, n * e, gain=g)
bed(4.4, 22.6, 18, .05); bed(35.0, 41.2, 18, .05)            # café murmur
bed(20.0, 22.6, 18, -.02)                                     # duck under the slow-mo noticing
bed(26.5, 35.0, 4, .045, mod=.8)                              # fire crackle base
for k in range(60): put(amb, 26.5 + rng.uniform(0, 8.4), tick(rng.uniform(.05, .2)), pan=rng.uniform(-.5, .5))
bed(26.5, 35.0, 60, .06, mod=.5)                              # wind
bed(41.0, 47.6, 40, .05)                                      # street
bed(47.5, 50.2, 80, .07); bed(63.0, 69.1, 80, .07)            # engine / road
for k in range(8): put(amb, 63.3 + k * .75, lp(noise(.5), 10) * np.sin(np.pi * np.minimum(1, tt(.5) / .5)), gain=.05, pan=rng.uniform(-.7, .7))  # passing cars
bed(74.0, 89.2, 70, .035); bed(89.0, 96.0, 70, .03)           # city at night

# ---------- SFX ----------
def chime(t, n, g=.2, pan=0.0): put(sfx, t, piano(midi(n), 2.0, 1.0), pan=pan, gain=g)
def step(t, g=.12): x = tt(.12); put(sfx, t, lp(noise(.12), 6) * np.exp(-x * 40), gain=g)
for k in range(6): step(4.8 + k * .55, .09)                                  # walking in
x = tt(1.4); put(sfx, 12.0, (noise(1.4) - lp(noise(1.4), 3)) * np.exp(-x * 2.5) * .5, gain=.12)   # espresso hiss
put(sfx, 12.55, piano(midi(96), .6, 1) + piano(midi(103), .6, .6), gain=.12)   # cup on saucer
chime(14.6, 88, .18, .3); chime(14.75, 93, .14, .3)                          # door chime
for k in range(4): step(15.0 + k * .9, .1)                                    # slow-motion steps
x = tt(.7); put(sfx, 37.75, (noise(.7) - lp(noise(.7), 2)) * np.exp(-x * 8), gain=.25)   # glass crack
for k in range(14): put(sfx, 38.1 + k * .03, piano(midi(int(rng.choice([96, 98, 100, 103, 105]))), .8, .6), pan=rng.uniform(-.8, .8), gain=.06)
for k in range(6): step(41.2 + k * .5, .07)
x = tt(.35); put(sfx, 46.3, lp(noise(.35), 4) * np.exp(-x * 12), gain=.25)        # car door open
put(sfx, 47.25, np.sin(2 * np.pi * 60 * tt(.25)) * np.exp(-tt(.25) * 20), gain=.5)  # door thunk
x = tt(1.2); put(sfx, 47.5, np.sin(2 * np.pi * np.cumsum(38 + 30 * np.minimum(1, x / .4)) / SR) * np.minimum(1, x / .1) * .4, gain=.4)   # engine start
put(sfx, 50.2, lp(noise(.4), 6) * np.exp(-tt(.4) * 9), gain=.15)              # apartment door
for k in range(12): step(50.6 + k * .09, .05)                                 # paws
x = tt(.18); put(sfx, 52.3, lp(np.tanh(3 * np.sin(2 * np.pi * np.cumsum(900 - 400 * x / .18) / SR)), 3) * np.exp(-x * 10), gain=.12)   # tiny bark
chime(69.45, 91, .16); chime(70.05, 88, .14)                                  # notifications
for k in range(4): step(74.3 + k * .55, .07)

# ---------- MIX ----------
def reverb(x, secs=2.6, wet=.35):
    ir = noise(secs) * np.exp(-tt(secs) * 3.0); ir = lp(ir, 3); ir /= np.sqrt(np.sum(ir ** 2))
    n = len(x) + len(ir); nf = 1 << (n - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, nf) * np.fft.rfft(ir, nf), nf)[:len(x)]
    return x * (1 - wet) + y * wet * .6
for ch in range(2):
    mus[:, ch] = reverb(mus[:, ch], 2.8, .4)
    sfx[:, ch] = reverb(sfx[:, ch], 1.4, .2)
mix = mus * .9 + amb + sfx
x = np.arange(N) / SR
mix *= np.minimum(1, x / 1.0)[:, None] * np.minimum(1, (DUR - x) / 1.6)[:, None]
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.2) / np.tanh(1.2) * .89
pcm = (mix * 32767).astype('<i2')
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
