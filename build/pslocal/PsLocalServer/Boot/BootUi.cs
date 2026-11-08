// 首启进度条 UI（uGUI，程序化搭建；只依赖游戏自带模块）。
// v5：自带每帧驱动（BootUiDriver.Update → Tick）——填充条平滑追目标进度、100% 后淡出、
//     淡出完成回调 OnGone（Bootstrap 收到后才放行 logo，避免 logo 从进度条底下"露"出来）。
//     旧版只有淡出阶段才建驱动，填充条在 100% 前从不动画（只跳文字），已废弃。
// v6：背景 = 基座 APK 内置 loading 海报随机一张（assets/ui/1firstres/textures/loading*.ab，
//     十三张，与游戏 loading 界面同源：CfgPreLoadTips.bgs 名单），半透明铺在原纯色底上
//     （纯色底保留 ⇒ 海报加载失败静默回落，背景是装饰不是功能，绝不能挡启动）；
//     底部文案改 "Funky Star"，左下角加版本号。
using System;
using UnityEngine;
using UnityEngine.UI;

namespace PsLocalServer
{
    public class BootUi
    {
        private const string VERSION_TEXT = "V1.0.0";
        private const float POSTER_ALPHA = 0.40f;
        // 与 CfgPreLoadTips.bgs[1] 同名单（"Loading" 是游戏首次进图的固定海报）
        private static readonly string[] POSTER_NAMES = {
            "Loading", "Loading1", "Loading2", "Loading3", "Loading4", "Loading5",
            "Loading6", "Loading7", "Loading8", "Loading9", "Loading10", "Loading11", "Loading12",
        };

        private GameObject _canvasGo;
        private GameObject _root;
        private GameObject _driverGo;
        private Text _stage;
        private Text _pct;
        private RectTransform _fill;
        private Image _poster;      // 海报（异步就绪后插入 bg 之上、其余 UI 之下；失败保持 null）
        private float _target = 0f;
        private float _shown = 0f;
        private bool _done;
        private float _fade = 1f;

        /// <summary>淡出并销毁完成后回调一次（主线程；Bootstrap 用它放行 logo 流程）。</summary>
        public Action OnGone;

        public void Build()
        {
            _canvasGo = new GameObject("PsBootCanvas", typeof(Canvas), typeof(CanvasScaler), typeof(CanvasRenderer));
            var canvas = _canvasGo.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.sortingOrder = 30000;
            var scaler = _canvasGo.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1280, 720);

            var camGo = new GameObject("PsBootRoot");
            camGo.transform.SetParent(_canvasGo.transform, false);
            _root = camGo;
            var rt = camGo.AddComponent<RectTransform>();
            Stretch(rt);

            var bg = camGo.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.07f, 0.1f, 1f);

            var font = LoadFont();

            _stage = MakeText(camGo.transform, font, 26, new Vector2(0, 60), TextAnchor.MiddleCenter);
            _stage.text = "方舟指令 · 单机版";

            _pct = MakeText(camGo.transform, font, 20, new Vector2(0, -40), TextAnchor.MiddleCenter);

            // 进度条：底槽 + 填充
            var slotGo = new GameObject("slot", typeof(Image));
            slotGo.transform.SetParent(camGo.transform, false);
            var slotRt = slotGo.GetComponent<RectTransform>();
            slotRt.sizeDelta = new Vector2(640, 22);
            slotRt.anchoredPosition = new Vector2(0, 10);
            slotGo.GetComponent<Image>().color = new Color(1, 1, 1, 0.15f);

            var fillGo = new GameObject("fill", typeof(Image));
            fillGo.transform.SetParent(slotGo.transform, false);
            _fill = fillGo.GetComponent<RectTransform>();
            // 填充块锚定在【槽左缘】+ pivot 左中：sizeDelta.x 增长时只向右扩。
            // （旧版用默认居中锚点 + 固定 anchoredPosition=-320：宽度一涨中心就越过槽左缘，
            //   一半填充悬在槽外左侧——2026-10-10 用户真机截图实证，修复于 v5。）
            _fill.anchorMin = new Vector2(0f, 0.5f);
            _fill.anchorMax = new Vector2(0f, 0.5f);
            _fill.pivot = new Vector2(0f, 0.5f);
            _fill.sizeDelta = new Vector2(0, 22);
            _fill.anchoredPosition = Vector2.zero;
            var fimg = fillGo.GetComponent<Image>();
            fimg.color = new Color(0.4f, 0.75f, 1f, 1f);

            var ver = MakeText(camGo.transform, font, 14, new Vector2(0, -320), TextAnchor.MiddleCenter);
            ver.text = "Funky Star";

            // 版本号：左下角（锚点/轴心都钉到左下角，14px 内边距）
            var vver = MakeText(camGo.transform, font, 14, new Vector2(14, 8), TextAnchor.LowerLeft,
                Vector2.zero, Vector2.zero, Vector2.zero);
            vver.text = VERSION_TEXT;

            // 每帧驱动：进度追赶 + 淡出（旧版只在 100% 后才开始驱动，填充条此前从不动画）
            _driverGo = new GameObject("PsBootDriver");
            _driverGo.AddComponent<BootUiDriver>().ui = this;

            TryLoadPoster();
        }

        private Text MakeText(Transform parent, Font font, int size, Vector2 pos, TextAnchor anchor,
            Vector2? anchorMin = null, Vector2? anchorMax = null, Vector2? pivot = null)
        {
            var go = new GameObject("t" + size, typeof(Text));
            go.transform.SetParent(parent, false);
            var rt = go.GetComponent<RectTransform>();
            rt.sizeDelta = new Vector2(900, 40);
            rt.anchoredPosition = pos;
            rt.anchorMin = anchorMin ?? new Vector2(0.5f, 0.5f);
            rt.anchorMax = anchorMax ?? new Vector2(0.5f, 0.5f);
            rt.pivot = pivot ?? new Vector2(0.5f, 0.5f);
            var t = go.GetComponent<Text>();
            t.font = font;
            t.fontSize = size;
            t.alignment = anchor;
            t.color = new Color(0.92f, 0.94f, 1f, 0.95f);
            t.horizontalOverflow = HorizontalWrapMode.Overflow;
            return t;
        }

        /// <summary>
        /// 随机挑一张海报，交给驱动协程去加载（见 BootUiDriver.LoadPoster 的通道说明）。
        /// </summary>
        private void TryLoadPoster()
        {
            var name = POSTER_NAMES[UnityEngine.Random.Range(0, POSTER_NAMES.Length)];
            if (_driverGo != null)
                _driverGo.GetComponent<BootUiDriver>().StartPoster(this, name);
        }

        /// <summary>
        /// AB 字节就绪后建海报 Image（半透明，压在纯色底之上、文字/进度条之下）。
        /// 整链 try/catch + 逐步日志：背景是装饰不是功能，任何失败都回落纯色底，绝不挡启动。
        /// 必须主线程调（Unity 对象）；协程回调在主线程。
        /// </summary>
        internal void ApplyPoster(byte[] ab, string name)
        {
            try
            {
                var bundle = AssetBundle.LoadFromMemory(ab);
                if (bundle == null) { Debug.LogError("[PsLocal] boot poster: bundle null (" + name + ")"); return; }
                try
                {
                    var texs = bundle.LoadAllAssets<Texture2D>(); // 每个 AB 恰好一张海报
                    if (texs == null || texs.Length == 0) { Debug.LogError("[PsLocal] boot poster: no texture (" + name + ")"); return; }
                    var tex = texs[0];
                    var go = new GameObject("poster", typeof(Image));
                    go.transform.SetParent(_root.transform, false);
                    go.transform.SetSiblingIndex(1); // bg(0) 之上、文字/进度条之下
                    Stretch(go.GetComponent<RectTransform>());
                    _poster = go.GetComponent<Image>();
                    _poster.sprite = Sprite.Create(tex, new Rect(0, 0, tex.width, tex.height),
                        new Vector2(0.5f, 0.5f), 100f);
                    _poster.color = new Color(1f, 1f, 1f, POSTER_ALPHA * (_done ? _fade : 1f));
                    Debug.Log("[PsLocal] boot poster: ok " + name + " " + tex.width + "x" + tex.height);
                }
                finally
                {
                    bundle.Unload(false); // 已加载对象保留（Unload(true) 会销毁纹理）
                }
            }
            catch (Exception e)
            {
                try { Debug.LogError("[PsLocal] boot poster: " + e); } catch { }
            }
        }

        private static Font LoadFont()
        {
            Font f = null;
            try { f = Resources.GetBuiltinResource<Font>("Arial.ttf"); } catch { }
            if (f == null) try { f = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf"); } catch { }
            return f;
        }

        private static void Stretch(RectTransform rt)
        {
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;
        }

        public void Set(string stage, double pct)
        {
            if (_done) return; // 100% 后冻结（就绪文案不被迟到的进度覆盖）
            if (_stage != null) _stage.text = stage;
            if (_pct != null) _pct.text = (pct * 100).ToString("F1") + "%";
            _target = (float)pct;
            if (_target >= 1f) _done = true; // 不再另建 FadeOut，驱动本就每帧在跑
        }

        public void SetStatus(string s) { /* 服务端日志镜像可在此滚屏；alpha 版只显示阶段 */ }

        /// <summary>每帧驱动（主线程）：填充条平滑追赶目标；_done 后整层淡出并回调 OnGone。</summary>
        internal void Tick()
        {
            if (_root == null) return;
            _shown += (_target - _shown) * 0.18f;
            if (_fill != null) _fill.sizeDelta = new Vector2(640f * Mathf.Clamp01(_shown), 22);
            if (_done)
            {
                _fade -= 0.03f;
                if (_fade <= 0f)
                {
                    Destroy();
                    var cb = OnGone;
                    OnGone = null;
                    if (cb != null) cb();
                }
                else if (_root != null)
                {
                    // v6：海报保持自身基础透明度（整层淡出 = 基础 alpha × _fade），
                    //     其余元素按原样跟随 _fade——统一乘 _fade 会把 0.40 的海报顶回全不透明。
                    foreach (var img in _root.GetComponentsInChildren<Image>())
                        img.color = new Color(img.color.r, img.color.g, img.color.b,
                            (img == _poster) ? POSTER_ALPHA * _fade : _fade);
                    foreach (var txt in _root.GetComponentsInChildren<Text>()) txt.color = new Color(txt.color.r, txt.color.g, txt.color.b, _fade);
                }
            }
        }

        private void Destroy()
        {
            if (_driverGo != null) { UnityEngine.Object.Destroy(_driverGo); _driverGo = null; }
            if (_canvasGo != null) { UnityEngine.Object.Destroy(_canvasGo); _canvasGo = null; }
            if (_root != null) { _root = null; }
            _fill = null;
        }

        private class BootUiDriver : MonoBehaviour
        {
            public BootUi ui;
            private void Update() { if (ui != null) ui.Tick(); }

            public void StartPoster(BootUi bootUi, string name)
            {
                StartCoroutine(LoadPoster(bootUi, name));
            }

            /// <summary>
            /// 海报加载协程：WWW 读基座 APK 内置 AB（jar URI = Unity 引擎自己的
            /// StreamingAssets 通道，字节数组由引擎封送）。⚠️ 不用 AndroidJavaObject 读流：
            /// 它的 byte[] **参数**不回拷——Java 侧 read(byte[]) 填的是 JNI 数组，托管 buf 恒全零，
            /// LoadFromMemory 吃到全零数据报 "Failed to decompress data for the AssetBundle 'Memory'"
            /// 并返回 null（2026-11-08 MuMu logcat 实证）。PC/无设备上 WWW.error → 回落纯色底。
            /// </summary>
            private System.Collections.IEnumerator LoadPoster(BootUi bootUi, string name)
            {
                // ⚠️ APK 内条目是小写文件名（loading9.ab），海报显示名是 Loading9——
                //    jar URI 同样区分大小写（真机首验 FileNotFound 即此）。
                var url = "jar:file://" + Application.dataPath + "!/assets/ui/1firstres/textures/"
                          + name.ToLower() + ".ab";
                var www = new WWW(url);
                yield return www;
                try
                {
                    if (!string.IsNullOrEmpty(www.error))
                    {
                        Debug.LogError("[PsLocal] boot poster: " + www.error + " (" + url + ")");
                        yield break;
                    }
                    bootUi.ApplyPoster(www.bytes, name);
                }
                finally
                {
                    www.Dispose();
                }
            }
        }
    }
}
