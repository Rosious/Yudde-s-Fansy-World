Fix the Cocos Creator 3.8 project at D:/Yudde-Demo/cocos-project so it builds successfully.

Current state:
- MainScene.scene has full node hierarchy: Canvas -> MatchGrid/Header(GoldIcon+GoldLabel)/BottomBar(BtnMatch/BtnShop/BtnDress)/ContentContainer
- GoldLabel has cc.Label, buttons have cc.Button
- Placeholder textures in assets/textures/
- Logic layer (169 tests) copied to assets/scripts/systems/ and core/
- MCP server at http://localhost:3000, extensions/cocos-mcp-server/ must stay

Tasks:
1. Verify import paths in assets/scripts/ui/*.ts - fix any pointing outside project
2. Fix @property decorator types (Number -> CCFloat/CCInteger) and add missing imports
3. Clean library/ and temp/ directories
4. Save scene via curl http://localhost:3000/api/scene/save_scene
5. Try building via curl http://localhost:3000/api/project/build_project
6. If build fails, read /d/Yudde-Demo/cocos-project/temp/logs/project.log for errors and fix them
7. Iterate until build succeeds
8. When done, git add -A && git commit -m 'feat: working Cocos project with MCP'
