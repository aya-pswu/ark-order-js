# -*- coding: utf-8 -*-
"""应用图标档位生成：方舟指令3.webp → out/icons/<bucket>.png（各密度档 PNG）。

为什么单独成脚本且不加 -S：解码 webp 需要 Pillow（site-packages），而 make.py 的
打包步骤统一 `python -S`（只用标准库，绕开 sitecustomize 的批量删除确认钩子）——
所以本脚本作为**独立前置步骤**跑（make.py ②c，无 -S），产物由 build_standalone_apk.py
（-S、纯标准库）按 out/icons/ 现成文件消费。与 out/logoFirst.asset.patched 同模式：
预生成产物 + 打包脚本只读。

幂等：每次全量重生成（10 档，秒级）。档位清单与 build_standalone_apk.py 的
ICON_DENSITY_SIZES 保持一致——build 侧对缺档 fail-fast，清单漂移会立刻暴露。
"""
import io
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ICON_SRC = os.environ.get('FZZL_ICON_SRC') or os.path.join(ROOT, '方舟指令3.webp')
ICONS_OUT = os.path.join(HERE, 'out', 'icons')

# aapt dump badging 的 application-icon-*（6 档密度）+ 基座包内实测的 sw360dp 四档
BUCKETS = {
    'drawable-ldpi-v4': 36,
    'drawable-mdpi-v4': 48,
    'drawable-hdpi-v4': 72,
    'drawable-xhdpi-v4': 96,
    'drawable-xxhdpi-v4': 144,
    'drawable-xxxhdpi-v4': 192,
    'drawable-sw360dp-hdpi': 192,
    'drawable-sw360dp-xhdpi': 256,
    'drawable-sw360dp-xxhdpi': 384,
    'drawable-sw360dp-xxxhdpi': 512,
}


def main():
    try:
        from PIL import Image
    except ImportError:
        sys.exit('需要 Pillow（本步骤不加 -S）：pip install pillow')
    if not os.path.isfile(ICON_SRC):
        sys.exit('缺少应用图标源文件：' + ICON_SRC)
    im = Image.open(ICON_SRC).convert('RGBA')
    os.makedirs(ICONS_OUT, exist_ok=True)
    for bucket, size in sorted(BUCKETS.items()):
        b = io.BytesIO()
        im.resize((size, size), Image.LANCZOS).save(b, 'PNG')
        fp = os.path.join(ICONS_OUT, bucket + '.png')
        with open(fp, 'wb') as f:
            f.write(b.getvalue())
        print('   %-28s %3dx%-3d  %7d B' % (bucket, size, size, len(b.getvalue())))
    print('图标档位完成：' + ICONS_OUT)
    return 0


if __name__ == '__main__':
    sys.exit(main())
