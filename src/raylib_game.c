/*******************************************************************************************
*
*   raylib 9years gamejam template
*
*   Template originally created with raylib 4.5-dev, last time updated with raylib 4.5-dev
*
*   Template licensed under an unmodified zlib/libpng license, which is an OSI-certified,
*   BSD-like license that allows static linking with closed source software
*
*   Copyright (c) 2022 Ramon Santamaria (@raysan5)
*
********************************************************************************************/

#include "raylib.h"
#include "hello.h"

#if defined(PLATFORM_WEB)
#define CUSTOM_MODAL_DIALOGS            // Force custom modal dialogs usage
#include <emscripten/emscripten.h>      // Emscripten library - LLVM to JavaScript compiler
#endif

#include <stdio.h>                          // Required for: printf()
#include <stdlib.h>                         // Required for: 
#include <string.h>                         // Required for: 

//----------------------------------------------------------------------------------
// Defines and Macros
//----------------------------------------------------------------------------------
// Simple log system to avoid printf() calls if required
// NOTE: Avoiding those calls, also avoids const strings memory usage
#define SUPPORT_LOG_INFO
#if defined(SUPPORT_LOG_INFO)
#define LOG(...) printf(__VA_ARGS__)
#else
#define LOG(...)
#endif

//----------------------------------------------------------------------------------
// Types and Structures Definition
//----------------------------------------------------------------------------------
typedef enum {
	SCREEN_LOGO = 0,
	SCREEN_TITLE,
	SCREEN_GAMEPLAY,
	SCREEN_ENDING
} GameScreen;

// TODO: Define your custom data types here

//----------------------------------------------------------------------------------
// Global Variables Definition
//----------------------------------------------------------------------------------
static const int screenWidth = 256;
static const int screenHeight = 256;

static unsigned int screenScale = 3;
static unsigned int prevScreenScale = 1;

static RenderTexture2D target = { 0 };  // Initialized at init

// TODO: Define global variables here, recommended to make them static

//----------------------------------------------------------------------------------
// Module Functions Declaration
//----------------------------------------------------------------------------------
static void UpdateDrawFrame(void);      // Update and Draw one frame

//------------------------------------------------------------------------------------
// Program main entry point
//------------------------------------------------------------------------------------
int main(void)
{
#if !defined(_DEBUG)
	SetTraceLogLevel(LOG_NONE);         // Disable raylib trace log messsages
#endif

	// Initialization
	//--------------------------------------------------------------------------------------
	InitWindow(screenWidth, screenHeight, "raylib 9yr gamejam");

	// TODO: Load resources / Initialize variables at this point

	// Render texture to draw full screen, enables screen scaling
	// NOTE: If screen is scaled, mouse input should be scaled proportionally
	target = LoadRenderTexture(screenWidth, screenHeight);
	SetTextureFilter(target.texture, TEXTURE_FILTER_BILINEAR);

#if defined(PLATFORM_WEB)
	emscripten_set_main_loop(UpdateDrawFrame, 60, 1);
#else
	SetTargetFPS(60);     // Set our game frames-per-second
	//--------------------------------------------------------------------------------------

	// Main game loop
	while (!WindowShouldClose())    // Detect window close button
	{
		UpdateDrawFrame();
	}
#endif

	// De-Initialization
	//--------------------------------------------------------------------------------------
	UnloadRenderTexture(target);

	// TODO: Unload all loaded resources at this point

	CloseWindow();        // Close window and OpenGL context
	//--------------------------------------------------------------------------------------

	return 0;
}

//--------------------------------------------------------------------------------------------
// Module functions definition
//--------------------------------------------------------------------------------------------
// Update and draw frame
void UpdateDrawFrame(void)
{

	static bool init = false;
	static Camera camera = { 0 };
	static Vector3 cubePosition = { 0.0f, 0.0f, 0.0f };
	static Vector2 cubeScreenPosition = { 0.0f, 0.0f };
	static Texture2D texture;
	if (!init) {
		init = true;
		camera.position = (Vector3){ 10.0f, 10.0f, 10.0f };
		camera.target = (Vector3){ 0.0f, 0.0f, 0.0f };
		camera.up = (Vector3){ 0.0f, 1.0f, 0.0f };
		camera.fovy = 45.0f;
		camera.projection = CAMERA_PERSPECTIVE;
		SetCameraMode(camera, CAMERA_FREE); // Set a free camera mode
		texture = LoadTexture("resources/texture.png");
	}

	// Update
	//----------------------------------------------------------------------------------
	// Screen scale logic (x2)
	if (IsKeyPressed(KEY_ONE)) screenScale = 1;
	else if (IsKeyPressed(KEY_TWO)) screenScale = 2;
	else if (IsKeyPressed(KEY_THREE)) screenScale = 3;

	if (screenScale != prevScreenScale)
	{
		// Scale window to fit the scaled render texture
		SetWindowSize(screenWidth * screenScale, screenHeight * screenScale);

		// Scale mouse proportionally to keep input logic inside the 256x256 screen limits
		SetMouseScale(1.0f / (float)screenScale, 1.0f / (float)screenScale);

		prevScreenScale = screenScale;
	}

	// TODO: Update variables / Implement example logic at this point
	//----------------------------------------------------------------------------------

	UpdateCamera(&camera);

	// Calculate cube screen space position (with a little offset to be in top)
	cubeScreenPosition = GetWorldToScreen((Vector3) { cubePosition.x, cubePosition.y + 2.5f, cubePosition.z }, camera);
	//----------------------------------------------------------------------------------

	// Draw
	//----------------------------------------------------------------------------------
	BeginTextureMode(target);


	//DrawTexturePro(target.texture, (Rectangle) { 0, 0, (float)target.texture.width, -(float)target.texture.height }, (Rectangle) { 0, 0, (float)target.texture.width* screenScale, (float)target.texture.height* screenScale }, (Vector2) { 0, 0 }, 0.0f, WHITE);

	// Draw equivalent mouse position on the target render-texture
	DrawCircleLines(GetMouseX(), GetMouseY(), 10, MAROON);

	ClearBackground(RAYWHITE);

	BeginMode3D(camera);

	DrawCubeTexture(texture, cubePosition, 2.0f, 2.0f, 2.0f, WHITE);
	DrawCubeWires(cubePosition, 2.0f, 2.0f, 2.0f, MAROON);

	DrawGrid(10, 1.0f);

	EndMode3D();

	DrawText("Enemy: 100 / 100", (int)cubeScreenPosition.x - MeasureText("Enemy: 100/100", 20) / 2, (int)cubeScreenPosition.y, 20, BLACK);
	DrawText("Text is always on top of the cube", (screenWidth - MeasureText("Text is always on top of the cube", 20)) / 2, 25, 20, GRAY);

	EndTextureMode();


	BeginDrawing();
	ClearBackground(RAYWHITE);  // Clear screen background

	// Enable shader using the custom uniform
	
	// NOTE: Render texture must be y-flipped due to default OpenGL coordinates (left-bottom)
	DrawTexturePro(target.texture, (Rectangle) { 0, 0, (float)target.texture.width, -(float)target.texture.height }, (Rectangle) { 0, 0, (float)target.texture.width* screenScale, (float)target.texture.height* screenScale }, (Vector2) { 0, 0 }, 0.0f, WHITE);

	// Draw some 2d text over drawn texture
	
	DrawFPS(10, 10);
	EndDrawing();
	//----------------------------------------------------------------------------------  
}