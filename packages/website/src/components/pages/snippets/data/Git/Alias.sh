# superlog
git config --global alias.superlog "log --graph --abbrev-commit --decorate --date=relative --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(bold yellow)%d%C(reset)' --all"

## alias with parameters
git config --global alias.pt-pull '!f() { git checkout development; git pull; git checkout task/$1; git pull; git merge development; }; f'