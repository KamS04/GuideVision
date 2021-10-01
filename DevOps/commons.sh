# HomeServer
./update -Server homeserver -BaseDirOnServer "~/Documents/GuideVision" -AppName "GuidingVision"
./transfer -Server homeserver -LocalDatabase "D:\Code\web\Projects\CAS\GuideVision\DB-Browser\database.db" -BaseDirOnServer "~/Documents/GuideVision" -AppName "GuidingVision"

# Homeserver via bash
./update.sh -s homeserver -b "~/Documents/GuideVision" -a "GuidingVision"
./transfer.sh -s homeserver -l "D:\Code\web\Projects\CAS\GuideVision\DB-Browser\database.db" -b "~/Documents/GuideVision" -a "GuidingVision"

# DigitalOcean
./update -Server guidingvision -BaseDirOnServer "~/GuidingVision" -AppName "GuidingVision"
./transfer -Server guidingvision -LocalDatabase "D:\Code\web\Projects\CAS\GuideVision\DB-Browser\database.db" -BaseDirOnServer "~/GuidingVision" -AppName "GuidingVision"

# Digital Ocean via bash
./update.sh -s guidingvision -b "~/GuideVision" -a "GuidingVision"
./transfer.sh -s guidingvision -l "D:\Code\web\Projects\CAS\GuideVision\DB-Browser\database.db" -b "~/GuidingVision" -a "GuidingVision"


# Get # of Visits
sudo cat /var/log/nginx/access.log | grep "guidingvision.org/\(programs\|universities\|pathways\|compare\|search\)\?\"" -o | wc -l