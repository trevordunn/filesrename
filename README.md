# Files Rename
A simple script that renames a group of files to their file's creation date. Handy for retaining the date you took a photo (for example), and makes them easy to sort.<br />
Ex) "IMG_1234.jpg" -> "2016-01-28 20.17.50.jpg"

## Setup
0. Install the latest LTS version of NodeJS from https://nodejs.org/en/
0. If using a terminal to run it, run `npm install`

## How to run it
0. Put all your photos that you want to rename in the "in" folder. They will be _copied_ into the "out" folder with their new names.
0. A couple options for running the script:
 0. On Windows: right-click run.ps1 and select "Run with PowerShell"
 0. On Windows/Mac: open up a terminal, and run `grunt`.
    - You can optional add an "offset" param to change the time in milliseconds. Ex) `grunt --offset="3600000"` (adds an hour onto each photo)
0. All your renamed files should now be in the "out" folder.<br />
_Note: they are just copies._
