#!/usr/bin/env python3
"""Build a small Hanazono-derived WOFF2 subset for six PC Han codepoints.

Source: HanaMinB (Googlefonts/chinese at fixed Git SHA).
License: upstream Hanazono Font License / SIL OFL 1.1 dual license.
Change reserved font family names in this derivative and redistribute
the original license file alongside the subset.
"""
from pathlib import Path
from urllib.request import urlretrieve
import hashlib
from fontTools.ttLib import TTFont
from fontTools import subset

SOURCE_SHA="801aa43acbf9f5411f1131ec22dc3f75fda899e8"
UPSTREAM="https://raw.githubusercontent.com/googlefonts/chinese/"+SOURCE_SHA+"/fonts/HanaMin/"
CODEPOINTS=(0x29C09,0x20478,0x2076F,0x207B8,0x29D27,0x27971)
ROOT=Path(__file__).resolve().parent.parent
OUTPUT=ROOT/"fonts"/"han"/"YKTSmoothHanB.woff2"
LICENSE=ROOT/"fonts"/"han"/"YKTSmoothHanB-LICENSE.txt"
SOURCE_NOTES=ROOT/"fonts"/"han"/"YKTSmoothHanB-SOURCE.md"

tmp=Path("/tmp/ykt-smooth-han")
tmp.mkdir(exist_ok=True)
source=tmp/"HanaMinB.ttf"
license_source=tmp/"LICENSE.txt"
urlretrieve(UPSTREAM+"HanaMinB.ttf",source)
urlretrieve(UPSTREAM+"LICENSE.txt",license_source)
font=TTFont(source)
original_cmap=font.getBestCmap() or {}
missing=[f"U+{cp:05X}" for cp in CODEPOINTS if cp not in original_cmap]
if missing: raise RuntimeError("Source missing required glyphs: "+", ".join(missing))
opts=subset.Options()
opts.name_IDs=["*"]
opts.name_languages=["*"]
opts.notdef_glyph=True
opts.notdef_outline=True
subsetter=subset.Subsetter(options=opts)
subsetter.populate(unicodes=CODEPOINTS)
subsetter.subset(font)
family="YKT Unicode Smooth Han Subset"
renamed={1:family,2:"Regular",4:family+" Regular",
         6:"YKTUnicodeSmoothHanSubset-Regular",16:family,17:"Regular"}
for record in font["name"].names:
    if record.nameID in renamed:
        record.string=renamed[record.nameID].encode(record.getEncoding(),errors="replace")
font.flavor="woff2"
OUTPUT.parent.mkdir(parents=True,exist_ok=True)
font.save(OUTPUT)
font.close()
check=TTFont(OUTPUT)
actual=check.getBestCmap() or {}
if not all(cp in actual for cp in CODEPOINTS):
    raise RuntimeError("Subset missing codepoints")
if any(n in str([x.toUnicode() for x in check["name"].names if x.nameID in (1,4,6,16)])
       for n in ("HanaMin","Hanazono")):
    raise RuntimeError("Reserved upstream font name was not changed")
check.close()
LICENSE.write_bytes(license_source.read_bytes())
SOURCE_NOTES.write_text(
    "# YKT Unicode Smooth Han subset\n\n"
    "Original work: Hanazono Mincho B (HanaMinB), GlyphWiki Project.\n\n"
    "Original source: "+UPSTREAM+"HanaMinB.ttf\n\n"
    "This is a modified and subsetted font. Reserved Font Names were changed.\n"
    "See YKTSmoothHanB-LICENSE.txt for the full original copyright and license.\n\n"
    "Modification: selective glyph subsetting, font family renaming, and WOFF2\n"
    "compression using scripts/build-smooth-han-subset.py.\n\n"
    "Codepoints: "+", ".join(f"U+{cp:X}" for cp in CODEPOINTS)+".\n\n"
    "Upstream revision: "+SOURCE_SHA+".\n",
    encoding="utf-8"
)
print("Generated",OUTPUT,OUTPUT.stat().st_size,"bytes")
print("Original source SHA-256",hashlib.sha256(source.read_bytes()).hexdigest())
print("Subset codepoints:",*[f"U+{cp:X}" for cp in CODEPOINTS])
