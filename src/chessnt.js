

class Board{


	constructor(){
		this.x = 8
		this.y = 8
		this.movelog = [];
		this.board = [];
		this.a_h = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
		this.empty_token = "*";
		for (let i = 0; i<this.y;i++){
			let row = [];
			for (let j=0; j<this.x;j++){
				row.push(this.empty_token);
			}
			this.board.push(row);

		}
	}

	printRow(row, num){
		let string = num+"\t";
		row.forEach(item => {
			string = string + item + "\t";
		});
		string = string + num;
		console.log(string);
	}

	printBoard(){
		this.printRow(this.a_h, " ");
		for(let i = 1; i<=this.board.length; i++){
			this.printRow(this.board[i-1], i);
		}
		this.printRow(this.a_h, " ");
		
	}

	translate(alg){
		switch (alg[0]){
			case "a":
				return new Array(0, -1+parseInt(alg[1]));
			case "b":
				return new Array(1, -1+parseInt(alg[1]));
			case "c":
				return new Array(2, -1+parseInt(alg[1]));
			case "d":
				return new Array(3, -1+parseInt(alg[1]));
			case "e":
				return new Array(4, -1+parseInt(alg[1]));
			case "f":
				return new Array(5, -1+parseInt(alg[1]));
			case "g":
				return new Array(6, -1+parseInt(alg[1]));
			case "h":
				return new Array(7, -1+parseInt(alg[1]));

		}
		
	}
	
	parsePiece(cords, piece){
		let moves = [];
		let color = piece[0];
		console.log(color);
		switch (piece[2]){
			case "R":
				return this.checkRook(color, cords, moves);
			case "N":
				return this.checkKnight(color, cords, moves);
			case "B":
				return this.checlBishop(color, cords, moves);
			case "Q":
				return this.checkQueen(color, cords, moves);
			case "K":
				return this.checkKing(color, cords,  moves);
			case "p":
				return this.checkPawn(color, cords, moves);
			default:
				//empty space
				return moves;
		}
	}
	getPiece(alg){
		let cord = this.translate(alg);
		//console.log(cord);
		return this.board[cord[1]][cord[0]];
	}

	
	isOnBoard(cords){
		if (cords[0]<0 || cords[1]<0){
			console.log("returning false", cords);
			return false;
		}
		else if (cords[0]>this.x || cords[1]>this.y){
			console.log("returning false", cords);
			return false;
		}
		console.log("returning true", cords);
		return true;
	}
	//Assuming one knows it's a piece, no error checking
	getPieceColor(cords){
		let color = this.board[cord[1]][cord[0]][0];
		return color;
	}

	noCollision(cords, color){
		let piece = this.board[cords[1]][cords[0]];

		if (piece[0] === color){
			return false;
		}
		return true;
	}

	canCapture(cords, color){
		console.log("cords in canCapture is", cords);
		let piece = this.board[cords[1]][cords[0]];
		let isaPiece = piece[0] === "w" || piece[0] === "b" ? true : false;
		if (piece[0] !== color && isaPiece){
			return true;
		}
		return false;
	}

	// Deltas is a list of vectors, detailing possible directions to move
	// Multiple applications of the deltas determine a list of legal moves
	loopDeltas(deltas, cords,  num, moves, color){
	
		deltas.forEach(delta => {
			let xy = cords;

			for (let i = 0; i<num; i++){
				xy[0] += delta[0];
				xy[1] += delta[1];
				
				if (this.isOnBoard(xy) && this.noCollision(xy, color)){
					moves.push(xy);
					console.log("this cord passed isOnBoard and no Collision", xy);
					if (this.canCapture(xy, color)){
						break;
					}

				}
				else{
					break;
				}
			}
		});

		return moves;
	}
	// Helper functions to determine a list of legal moves for each piece
	// rook, knight, bishop, king and queen
	// pawns
	//
	checkRook(color, cords,  moves){
		let deltas = [[1, 0], [-1, 0], [0, 1], [0, -1]];
		

		return this.loopDeltas(deltas, cords, this.x<this.y ? this.y : this.x, moves, color);
	}
	checkKnight(color, cords, moves){
		let deltas = [[2, 1], [-2, 1], [2, -1], [-2, -1], [1, 2], [-1, 2], [1, -2], [-1, -2]];
		return this.loopDeltas(deltas, cords, 1, moves, color);
	}
	checkBishop(color, cords, moves){
		let deltas = [[1, 1], [-1, 1], [1, -1], [-1, -1]];

		return this.loopDeltas(deltas, cords, this.x<this.y ? this.y : this.x, moves, color);
	}
	checkQueen(color, cords, moves){
		moves = checkRook(color, cords, moves);
		moves = checkBishop(color, cords, moves);

		return moves;
	}
	checkKing(color, cords, moves){
		let deltas = [[1,0], [-1, 0], [0, 1], [0, -1]];
		
		return this.loopDeltas(deltas, cords, 1, moves, color);
	}
	checkPawnDiagonals(color, cords, moves){
		let isWhite = color === "w" ? true : false;
		if  (isWhite){

			let diagonal1 = [cords[0]+1, cords[1]+1];
			let diagonal2 = [cords[0]-1, cords[1]+1];
			if (this.canCapture(diagonal1, color)){
				moves.push(diagonal1);
			}
			if(this.canCapture(diagonal2, color)){
				moves.push(diagonal2);
			}
		}
		else{
			
			let diagonal1 = [cords[0]+1, cords[1]-1];
			let diagonal2 = [cords[0]-1, cords[1]-1];
			if (this.canCapture(diagonal1, color)){
				moves.push(diagonal1);
			}
			if(this.canCapture(diagonal2, color)){
				moves.push(diagonal2);
			}

		}
		//TODO: include en passant rules, need access to move history, as the legality is time sensitive
		return moves;
	}

	checkPawn(color, cords, moves){
		let isWhite = color==="w" ? true : false;
		let deltas = [];
		if (isWhite) {
			deltas.push([0, 1]);
		}
		else{
			deltas.push([0, -1]);
		}
		if (cords[0] === 1 && isWhite){
			deltas.push([0, 2]);
		}
		else if (cords[0] === this.board.length-1 && !isWhite){
			deltas.push([0, -2]);
		}
		//TODO some mistake here, make it safe
		console.log("Moves is", moves);
		moves = this.loopDeltas(deltas, cords, 1, moves, color);
		console.log("Moves is", moves);
		return this.checkPawnDiagonals(color, cords, moves);

	}

	//Get a list of legal moves for any piece, return empty list if hit an empty square
	legalMoves(alg){
		let cords = this.translate(alg);
		let piece = this.getPiece(alg);
		console.log(alg);
		console.log(cords);
		console.log(piece);
		return this.parsePiece(cords, piece);
		
	}

	insertPieces(){
		const pieces = ["R", "N", "B", "Q", "K", "B", "N", "R"];	
		const white = pieces.map(item => {
			return `w_${item}`;
		});

		const black = pieces.map(item => {
			return `b_${item}`;
		});
		//console.log(pieces);
		//console.log(white);
		//console.log(black);
		
		for (let i = 0; i<this.board[0].length; i++){
			this.board[0][i] = white[i];
			this.board[1][i] = "w_p"
		}
		
		for (let i = 0; i<this.board[this.board.length-1].length; i++){
			this.board[this.board.length-1][i] = black[i];
			this.board[this.board.length-2][i] = "b_p";
		}
	}
}




const chessBoard = new Board();
chessBoard.insertPieces();
chessBoard.printBoard();

console.log(chessBoard.legalMoves("a2"));

//console.log(chessBoard.getPiece("b1"));

//console.log(chessBoard.getBoard());


