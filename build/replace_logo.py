# -*- coding: utf-8 -*-
"""
替换客户端启动第一个 logo（logoFirst = bilibili）为 apkbuild/logo1.png。

事实依据（工作日志 2026-09-17）：
  Assets.Plugins.Scripts.Main.PlaySplashQueue 里 Resources.Load<Texture>("logoFirst") 是第 1 页
  bilibili logo；该 Texture2D 序列化在基座 APK 的 assets/bin/Data/39a00730784cfb24984c276f8ea8bda5
  （Unity 单资源文件，logoFirst 593×150 RGBA32 mip1，内嵌数据）。
  第二个 logo logoMingChao（明朝游戏）在 assets/bin/Data/1ba86f683a2e1468bbb04ff2b26717a5，不动。

本脚本用 UnityPy 打开该资产 → 找到名为 logoFirst 的 Texture2D → set_image(logo1.png)
→ 写回 out/logoFirst.asset.patched，并由 build_standalone_apk.py 在打包时替换 APK 内条目。
"""
import io
import os
import sys
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import UnityPy  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ASSET_APK_PATH = 'assets/bin/Data/39a00730784cfb24984c276f8ea8bda5'
BASE_APK = os.path.join(ROOT, 'tools', 'fzzl_lua_signed.apk')
LOGO1 = os.path.join(HERE, 'logo1.png')
OUT = os.path.join(HERE, 'out', 'logoFirst.asset.patched')


def main():
    with zipfile.ZipFile(BASE_APK) as z:
        data = z.read(ASSET_APK_PATH)
    from PIL import Image
    img = Image.open(LOGO1).convert('RGBA')

    env = UnityPy.load(io.BytesIO(data))
    done = 0
    for obj in env.objects:
        if obj.type.name != 'Texture2D':
            continue
        tex = obj.read()
        if getattr(tex, 'm_Name', None) != 'logoFirst':
            print('skip texture:', getattr(tex, 'm_Name', '?'))
            continue
        print('replace logoFirst %dx%d fmt=%s -> logo1.png %s' %
              (tex.m_Width, tex.m_Height, tex.m_TextureFormat, img.size))
        tex.set_image(img)
        tex.save()  # 写回该对象（保持其余对象与容器结构不动）
        done += 1

    if done == 0:
        sys.exit('VERIFY-FAIL: 未找到 logoFirst Texture2D')
    if done != 1:
        sys.exit('VERIFY-FAIL: logoFirst 出现 %d 次' % done)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'wb') as f:
        f.write(env.file.save())
    print('OK ->', OUT)

    # 回读校验
    env2 = UnityPy.load(OUT)
    for obj in env2.objects:
        if obj.type.name == 'Texture2D':
            tex2 = obj.read()
            im2 = tex2.image
            print('verify: %s %dx%d fmt=%s image=%s' %
                  (getattr(tex2, 'm_Name', '?'), tex2.m_Width, tex2.m_Height,
                   tex2.m_TextureFormat, im2.size))
            if getattr(tex2, 'm_Name', None) != 'logoFirst' or im2.size != img.size:
                sys.exit('VERIFY-FAIL: 回读不符')
    print('PASS')


if __name__ == '__main__':
    main()