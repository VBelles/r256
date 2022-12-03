# Prerequisites
*.d

# Object files
*.o
*.ko
*.obj
*.elf

# Linker output
*.ilk
*.map
*.exp

# Precompiled Headers
*.gch
*.pch

# Libraries
*.lib
*.a
*.la
*.lo

# Shared objects (inc. Windows DLLs)
*.dll
*.so
*.so.*
*.dylib

# Executables
*.exe
*.out
*.app
*.i*86
*.x86_64
*.hex

# Debug files
*.dSYM/
*.su
*.idb
*.pdb

# Kernel Module Compile Results
*.mod*
*.cmd
.tmp_versions/
modules.order
Module.symvers
Mkfile.old
dkms.conf

# Visual Studio files
[Dd]ebug/
[Dd]ebug.DLL/
[R]elease/
[Rr]elease.DLL/
*.user
.vs

# Build folder
[Bb]uild
cmake_minimum_required(VERSION 3.11) # FetchContent is available in 3.11+
project(r256)

# Generate compile_commands.json
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_C_STANDARD 11)

# Adding Raylib
include(FetchContent)
set(BUILD_EXAMPLES OFF CACHE BOOL "" FORCE) # don't build the supplied examples
set(BUILD_GAMES    OFF CACHE BOOL "" FORCE) # don't build the supplied example games
FetchContent_Declare(raylib GIT_REPOSITORY https://github.com/raysan5/raylib.git GIT_TAG 4.2.0)
FetchContent_MakeAvailable(raylib)

# Our Project
file(GLOB_RECURSE PROJECT_SOURCES CONFIGURE_DEPENDS "${CMAKE_CURRENT_LIST_DIR}/src/*.c") # Define PROJECT_SOURCES as a list of all source files
set(PROJECT_INCLUDE "${CMAKE_CURRENT_LIST_DIR}/src/") # Define PROJECT_INCLUDE to be the path to the include directory of the project

add_executable(${PROJECT_NAME})
target_sources(${PROJECT_NAME} PRIVATE ${PROJECT_SOURCES})
target_include_directories(${PROJECT_NAME} PRIVATE ${PROJECT_INCLUDE})
target_link_libraries(${PROJECT_NAME} PRIVATE raylib)



# Web Configurations
if (${PLATFORM} STREQUAL "Web")
    set(EMCC_LINKER_FLAGS "--preload-file resources --shell-file minshell.html")

    # Tell Emscripten to build an example.html file.
    set_target_properties(${PROJECT_NAME} PROPERTIES SUFFIX ".html")
else()
    add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
                    COMMAND ${CMAKE_COMMAND} -E copy_directory
                        ${CMAKE_SOURCE_DIR}/resources $<TARGET_FILE_DIR:${PROJECT_NAME}>/resources)
endif()

# Checks if OSX and links appropriate frameworks (Only required on MacOS)
if (APPLE)
    target_link_libraries(${PROJECT_NAME} "-framework IOKit")
    target_link_libraries(${PROJECT_NAME} "-framework Cocoa")
    target_link_libraries(${PROJECT_NAME} "-framework OpenGL")
endif()## C Coding Style Conventions

Code element | Convention | Example
--- | :---: | ---
Defines | ALL_CAPS | `#define PLATFORM_DESKTOP`
Macros | ALL_CAPS | `#define MIN(a,b) (((a)<(b))?(a):(b))`
Variables | lowerCase | `int screenWidth = 0;`, `float targetFrameTime = 0.016f;`
Local variables | lowerCase | `Vector2 playerPosition = { 0 };`
Global variables | lowerCase | `bool fullscreen = false;`
Constants | lowerCase | `const int maxValue = 8;`
Pointers | MyType *pointer | `Texture2D *array = NULL;`
float values | always x.xf | `float gravity = 10.0f`
Operators | value1*value2 | `int product = value*6;`
Operators | value1/value2 | `int division = value/4;`
Operators | value1 + value2 | `int sum = value + 10;`
Operators | value1 - value2 | `int res = value - 5;`
Enum | TitleCase | `enum TextureFormat`
Enum members | ALL_CAPS | `PIXELFORMAT_UNCOMPRESSED_R8G8B8`
Struct | TitleCase | `struct Texture2D`, `struct Material`
Struct typedef | TitleCase | `typedef struct Texture { ... } Texture;`
Struct members | lowerCase | `texture.width`, `color.r`
Functions | TitleCase | `InitWindow()`, `LoadImageFromMemory()`
Functions params | lowerCase | `width`, `height`
Ternary Operator | (condition)? result1 : result2 | `printf("Value is 0: %s", (value == 0)? "yes" : "no");`

Other conventions:
 - All defined variables are ALWAYS initialized
 - Four spaces are used, instead of TABS
 - Trailing spaces are always avoided
 - Control flow statements are followed **by a space**:
```c
if (condition) value = 0;

while (!WindowShouldClose())
{

}

for (int i = 0; i < NUM_VALUES; i++) printf("%i", i);

switch (value)
{
    case 0:
    {

    } break;
    case 2: break;
    default: break;
}
```
 - All conditions are always between parenthesis, but not boolean values:
```c
if ((value > 1) && (value < 50) && valueActive)
{

}
```
 - Braces and curly brackets always open-close in aligned mode:
```c
void SomeFunction()
{
   // TODO: Do something here!
}
```

## Files and Directories Naming Conventions

  - Directories are named using `snake_case`: `resources/models`, `resources/fonts`
  - Files are named using `snake_case`: `main_title.png`, `cubicmap.png`, `sound.wav`

_NOTE: Spaces and special characters are always avoided in the files/dir naming!_

## Games/Examples Directories Organization Conventions

 - Resource files are organized by context and usage in the game. Loading requirements for data are also considered (grouping data when required).
 - Descriptive names are used for the files, just reading the name of the file it should be possible to know what is that file and where fits in the game.

```
resources/audio/fx/long_jump.wav
resources/audio/music/main_theme.ogg
resources/screens/logo/logo.png
resources/screens/title/title.png
resources/screens/gameplay/background.png
resources/characters/player.png
resources/characters/enemy_slime.png
resources/common/font_arial.ttf
resources/common/gui.png
```
_NOTE: Some resources require to be loaded all at once while other require to be loaded only at initialization (gui, font)._
﻿Copyright (c) 2021-2022 Ramon Santamaria (@raysan5)

This software is provided "as-is", without any express or implied warranty. In no event 
will the authors be held liable for any damages arising from the use of this software.

Permission is granted to anyone to use this software for any purpose, including commercial 
applications, and to alter it and redistribute it freely, subject to the following restrictions:

  1. The origin of this software must not be misrepresented; you must not claim that you 
  wrote the original software. If you use this software in a product, an acknowledgment 
  in the product documentation would be appreciated but is not required.

  2. Altered source versions must be plainly marked as such, and must not be misrepresented
  as being the original software.

  3. This notice may not be removed or altered from any source distribution.
<!doctype html>
<html lang="en-us">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    
    <title>raylib web game</title>
    
    <meta name="title" content="raylib web game">
    <meta name="description" content="New raylib web videogame, developed using raylib videogames library">
    <meta name="keywords" content="raylib, games, html5, programming, C, C++, library, learn, videogames">
    <meta name="viewport" content="width=device-width">
    
    <!-- Open Graph metatags for sharing -->
    <meta property="og:title" content="raylib web game">
    <meta property="og:image:type" content="image/png">
    <meta property="og:image" content="https://www.raylib.com/common/img/raylib_logo.png">
    <meta property="og:site_name" content="raylib.com">
    <meta property="og:url" content="https://www.raylib.com/games.html">
    <meta property="og:description" content="New raylib web videogame, developed using raylib videogames library">

    <!-- Twitter metatags for sharing -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="@raysan5">
    <meta name="twitter:title" content="raylib web game">
    <meta name="twitter:image" content="https://www.raylib.com/common/raylib_logo.png">
    <meta name="twitter:url" content="https://www.raylib.com/games.html">
    <meta name="twitter:description" content="New raylib web game, developed using raylib videogames library">
    
    <!-- Favicon -->
    <link rel="shortcut icon" href="https://www.raylib.com/favicon.ico">
    
    <style>
        body { margin: 0px; }
        canvas.emscripten { border: 0px none; background-color: black; }
    </style>
    <script type='text/javascript' src="https://cdn.jsdelivr.net/gh/eligrey/FileSaver.js/dist/FileSaver.min.js"> </script>
    <script type='text/javascript'>
        function saveFileFromMEMFSToDisk(memoryFSname, localFSname)     // This can be called by C/C++ code
        {
            var isSafari = false; // Not supported, navigator.userAgent access is being restricted
            //var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            var data = FS.readFile(memoryFSname);
            var blob;

            if (isSafari) blob = new Blob([data.buffer], { type: "application/octet-stream" });
            else blob = new Blob([data.buffer], { type: "application/octet-binary" });

            // NOTE: SaveAsDialog is a browser setting. For example, in Google Chrome,
            // in Settings/Advanced/Downloads section you have a setting:
            // 'Ask where to save each file before downloading' - which you can set true/false.
            // If you enable this setting it would always ask you and bring the SaveAsDialog
            saveAs(blob, localFSname);
        }
    </script>
    </head>
    <body>
        <canvas class=emscripten id=canvas oncontextmenu=event.preventDefault() tabindex=-1></canvas>
        <p id="output" />
        <script>
            var Module = {
                print: (function() {
                    var element = document.getElementById('output');
                    if (element) element.value = ''; // clear browser cache
                    return function(text) {
                        if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
                        console.log(text);
                        if (element) {
                          element.value += text + "\n";
                          element.scrollTop = element.scrollHeight; // focus on bottom
                        }
                    };
                })(),            
                canvas: (function() {
                    var canvas = document.getElementById('canvas');
                    return canvas;
                })()
            };
        </script>
        {{{ SCRIPT }}}
    </body>
</html>
-----------------------------------

_DISCLAIMER:_

Welcome to **raylib 9 years gamejam template**!

This template provides a base structure to start developing a small raylib game in plain C for the raylib 9 years gamejam, considering the requested restrictions: 

 - Game must be 256x256 pixels screen size
 - Game must be compiled for web
 
NOTE: Several GitHub Actions workflows have been preconfigured to automatically build your game for Windows, Linux and WebAssembly on each commit. Those workflows automatically sync with latest version of raylib available to build.

The repo is also pre-configured with a default `LICENSE` (zlib/libpng) and a `README.md` (this one) to be properly filled by users. Feel free to change the LICENSE as required.

All the sections defined by `$(Data to Fill)` are expected to be edited and filled properly. It's recommended to delete this disclaimer message after editing this `README.md` file.

This template has been created to be used with raylib (www.raylib.com) and it's licensed under an unmodified zlib/libpng license.

_Copyright (c) 2022 Ramon Santamaria ([@raysan5](https://twitter.com/raysan5))_

-----------------------------------

## $(Game Title)

![$(Game Title)](screenshots/screenshot000.png "$(Game Title)")

### Description

$(Your Game Description)

### Features

 - $(Game Feature 01)
 - $(Game Feature 02)
 - $(Game Feature 03)

### Controls

Keyboard:
 - $(Game Control 01)
 - $(Game Control 02)
 - $(Game Control 03)

### Screenshots

_TODO: Show your game to the world, animated GIFs recommended!._

### Developers

 - $(Developer 01) - $(Role/Tasks Developed)
 - $(Developer 02) - $(Role/Tasks Developed)
 - $(Developer 03) - $(Role/Tasks Developed)

### Links

 - YouTube Gameplay: $(YouTube Link)
 - itch.io Release: $(itch.io Game Page)
 - Steam Release: $(Steam Game Page)

### License

This game sources are licensed under an unmodified zlib/libpng license, which is an OSI-certified, BSD-like license that allows static linking with closed source software. Check [LICENSE](LICENSE) for further details.

$(Additional Licenses)

*Copyright (c) $(Year) $(User Name) ($(User Twitter/GitHub Name))*
