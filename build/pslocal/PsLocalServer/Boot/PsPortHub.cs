// 端口预绑定中枢：Bootstrap.Init（PocoManager.Awake 时机）毫秒级绑好 8081/9021/44587，
// 游戏最早的 HTTP 配置请求立即有应答（C# 内建 responder）；Jint 冷启动完成后 JS 侧
// createServer/listen attach 到预绑定对象并接管，挂起中的连接/请求随后派发。
using System;
using System.Collections.Generic;

namespace PsLocalServer
{
    public static class PsPortHub
    {
        public static Shims.PsHttpServer Http;      // 8081
        public static Shims.PsTcpServer Game;       // 9021
        public static Shims.PsTcpServer Lua;        // 44587

        public static void PreBind(int httpPort, int gamePort, int luaPort)
        {
            try
            {
                Http = new Shims.PsHttpServer(null);
                Http.ListenBuiltin(httpPort);
            }
            catch (Exception e) { PsLog.Sink("prebind http " + httpPort + ": " + e.Message); }
            try
            {
                Game = new Shims.PsTcpServer(null);
                Game.ListenBuiltin(gamePort);
            }
            catch (Exception e) { PsLog.Sink("prebind game " + gamePort + ": " + e.Message); }
            try
            {
                Lua = new Shims.PsTcpServer(null);
                Lua.ListenBuiltin(luaPort);
            }
            catch (Exception e) { PsLog.Sink("prebind lua " + luaPort + ": " + e.Message); }
        }

        public static Shims.PsHttpServer TakeHttp(int port)
        {
            var s = Http;
            if (s != null && s.Port == port && !s.Taken) { s.Taken = true; return s; }
            return null;
        }

        public static Shims.PsTcpServer TakeTcp(int port)
        {
            var s = Game != null && Game.Port == port && !Game.Taken ? Game : (Lua != null && Lua.Port == port && !Lua.Taken ? Lua : null);
            if (s != null) s.Taken = true;
            return s;
        }

        // ---- 内建 HTTP 应答（纯 C#，Jint 就绪前兜底；与 server/http_router.js 的响应保持同形）----
        public static string BuiltinHttpRespond(string method, string url)
        {
            string body;
            var u = url ?? "";
            if (u.EndsWith("/client_api/GetAgentConfig.php"))
            {
                body = "{\"code\":\"300\",\"downloadRemoteRes\":\"0\",\"isSecondZipDone\":\"2\",\"upf\":\"\",\"srcIp\":\"127.0.0.1\",\"resStatic\":\"http://127.0.0.1:8081/res\",\"resStatic2\":\"\",\"appResourceUrl\":\"\",\"UpdateList\":[]}";
                return body;
            }
            if (u.EndsWith("/client_api/GetServerNotice.php"))
            {
                body = "{\"msg\":\"\",\"ret\":\"1\",\"data\":{\"port\":\"443\",\"bgp_host\":\"\",\"bgp_port\":\"\",\"agent_name\":\"biliandly\",\"time\":\"" + UnixNow() + "\",\"ip\":\"127.0.0.1\",\"content\":\"\",\"agent_id\":\"8\",\"title\":\"\",\"platform_id\":\"5\",\"sign\":\"1\",\"platform_name\":\"biliandly\",\"server_id\":\"1\",\"is_test\":\"0\"}}";
                return body;
            }
            if (u.EndsWith("/client_api/GetAccountNode.php"))
            {
                body = "{\"msg\":\"\",\"ret\":\"1\",\"data\":{\"ip\":\"127.0.0.1\",\"port\":\"9021\",\"bgp_host\":\"\",\"bgp_port\":\"\",\"agent_name\":\"biliandly\",\"agent_id\":\"8\",\"platform_id\":\"5\",\"platform_name\":\"biliandly\",\"time\":\"" + UnixNow() + "\",\"sign\":\"fzzl\",\"server_id\":\"1\",\"incheck\":0,\"is_test\":\"0\",\"content\":\"\",\"title\":\"\"}}";
                return body;
            }
            if (u.Contains("/metl/"))
            {
                body = "{\"ret\":\"1\",\"msg\":\"\",\"data\":{}}";
                return body;
            }
            return null; // 其余（ps_account、/res/**）等 JS 就绪后由 http_router 处理
        }

        static string UnixNow()
        {
            return ((long)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalSeconds).ToString();
        }
    }
}
