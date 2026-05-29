cd /d/Yudde-Demo/cocos-project
mkdir -p extensions/cocos-mcp-server
xcopy /E /Y C:\Users\lenovo\AppData\Local\Temp\cocos-mcp\* extensions\cocos-mcp-server\
cd extensions\cocos-mcp-server
call npm install
call npm run build
echo MCP_BUILD_DONE
