# Save a stash
git stash

## Restore all changes of the last stash
git stash apply

## Show all specific stash changes
git stash show stash@{0} -u

## Delete a specific stash
git stash drop -q stash@{0}

## Show all saved stashes
git stash list

## Restore all changes of a specific stash
git stash apply stash@{0}