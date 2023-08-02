class Card {
    constructor(name, value) {
        this.name = name;
        this.value = value;
        this.selected = false; // Add a selected property to track if the card is selected
    }

    draw(x, y, selected) {
        strokeWeight(4);
        stroke(100);
        fill(selected ? color(0, 150, 0) : 255); // Highlight selected cards with green color
        rect(x, y, 100, 150);
        textAlign(LEFT, TOP); // Align text to the top left corner
        fill(0);
        textSize(20);
        text(this.name, x + 5, y + 5); // Add an offset to move text away from the corner
    }
}