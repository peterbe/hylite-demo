bun run build:linux-x64
mv out/gg-linux-x64 /home/runner/.local/bin/gg
echo "/home/runner/.local/bin" >> $GITHUB_PATH
gg --version