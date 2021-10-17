# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
alias Rumbl.Multimedia

for category <- ~w{Action Drama Romance Comedy Sci-fi} do
  Multimedia.create_category!(category)
end

#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
