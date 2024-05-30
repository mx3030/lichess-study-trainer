function startTraining(){
    $('#start').addClass("d-none")
    $('#progress').removeClass("d-none")
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0]
    var reader = new FileReader()
    reader.addEventListener('load', function() {
        //run code if FileReader can get input because user selected pgn file
        //get pgn file as string to work with pgn-parser libary from github
        var pgn = reader.result;
        //use pgn-parser to split games
        var games = splitGames(pgn)
        //save every game pgn string in array pgn_strings
        pgn_strings = []
        for(var i=0;i<games.length;i++){
            var singleGame = games[i].all
            pgn_strings.push(singleGame)
        }
        pgn_strings_random = shuffleArray(pgn_strings)
        pgn_strings_random_length = pgn_strings_random.length
        //start with first random puzzle
        runPgn(pgn_strings_random_index)
    });
    reader.readAsText(file);
}

