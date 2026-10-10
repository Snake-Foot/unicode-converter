#!/usr/bin/env python3
"""One-time, read-only typography investigation for six PC CJK complaints.
No third-party font is committed, redistributed, or displayed by this probe.
"""
from pathlib import Path
from urllib.request import urlretrieve
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import DecomposingRecordingPen

CODES = ["29C09","20478","2076F","207B8","29D27","27971"]
SOURCES = {
    "HanaMinB": "https://raw.githubusercontent.com/googlefonts/chinese/801aa43acbf9f5411f1131ec22dc3f75fda899e8/fonts/HanaMin/HanaMinB.ttf",
    "I.Ming": "https://raw.githubusercontent.com/ichitenfont/I.Ming/b5410935f8be3d2c411b47d30261f74550f71184/8.10/I.Ming-8.10.ttf",
}
dest=Path("/tmp/uc-han-probe")
dest.mkdir(exist_ok=True)
for name,url in SOURCES.items():
    file=dest/(name+".ttf")
    print("DOWNLOAD",name,flush=True)
    try:
        urlretrieve(url,file)
        font=TTFont(file,lazy=True)
        cmap=font.getBestCmap() or {}
        glyph_set=font.getGlyphSet()
        for code in CODES:
            cp=int(code,16);g=cmap.get(cp)
            if not g:
                print(name,code,"MISSING",flush=True)
                continue
            pen=DecomposingRecordingPen(glyph_set)
            glyph_set[g].draw(pen)
            ops={}
            for cmd,pts in pen.value: ops[cmd]=ops.get(cmd,0)+1
            print(name,code,"PRESENT","name",g,"outline_ops",ops,flush=True)
        font.close()
    except Exception as e:
        print(name,"PROBE_ERROR",type(e).__name__,str(e),flush=True)
