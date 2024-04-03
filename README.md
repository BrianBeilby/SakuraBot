# SakuraBot

## Features
- **Music Playback**: Stream and control music directly within your Discord server with high-quality audio.
- **Language Translation**: Translate text between languages.
- **Text-to-Speech**: Convert your messages into spoken words in various languages.
- **Moderation Tools**: Some moderation tools.
- **AI Image Generation**: Generate images with [Replicate](https://replicate.com/).

## Setup Instructions
1. **Clone the repository**: `git clone https://github.com/BrianBeilby/SakuraBot.git`
2. **Install dependencies**: `npm install`
3. **Configure your bot**: Create a `.env` and update it with your Discord bot token and other configuration options.
4. **Run the bot**: `node index.js`

## Usage
- `/play <song name/url>`: Plays a song.
- `/translate <message> <language>`: Translates the message to the specified language.
- `/imagine <prompt> [model]`: Generates an image given a prompt with an optional AI model parameter.
- `/help overview`: Displays a general help message.
- `/help commands <command>`: Displays information about a specific command.
- `/help list`: Displays a list of all commands.
