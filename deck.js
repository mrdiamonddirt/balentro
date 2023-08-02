class Deck {
    constructor() {
        this.cards = [];
        this.createDeck();
    }

    createDeck() {
        const suits = ['♥', '🔸', '♣', '♠'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

        for (const suit of suits) {
            for (const value of values) {
                this.cards.push(new Card(value  + suit, value));
            }
        }
    }

    shuffle() {
        let m = this.cards.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = this.cards[m];
            this.cards[m] = this.cards[i];
            this.cards[i] = t;
        }
    }

    deal() {
        return this.cards.pop();
    }

    isEmpty() {
        return this.cards.length === 0;
    }
}
