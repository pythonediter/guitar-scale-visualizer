// Musiktheorie - Tonleitern und Skalen

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Intervalle in Halbtönen
const SCALE_INTERVALS = {
    major: [0, 2, 4, 5, 7, 9, 11],                          // Dur-Skala
    minor: [0, 2, 3, 5, 7, 8, 10],                          // Natürliche Moll
    'harmonic-minor': [0, 2, 3, 5, 7, 8, 11],               // Harmonische Moll
    'melodic-minor': [0, 2, 3, 5, 7, 9, 11],                // Melodische Moll
    'pentatonic-major': [0, 2, 4, 7, 9],                    // Pentatonik Dur
    'pentatonic-minor': [0, 3, 5, 7, 10],                   // Pentatonik Moll
    'blues': [0, 3, 5, 6, 7, 10]                            // Blues-Scala
};

// Akkord-Intervalle (Arpeggios)
const ARPEGGIO_INTERVALS = {
    major: [0, 4, 7],                  // Dur-Akkord (1-3-5)
    minor: [0, 3, 7],                  // Moll-Akkord (1-b3-5)
    'harmonic-minor': [0, 3, 7],        // Moll-Akkord
    'melodic-minor': [0, 3, 7],         // Moll-Akkord
    'pentatonic-major': [0, 4, 7],      // Dur-Akkord
    'pentatonic-minor': [0, 3, 7],      // Moll-Akkord
    'blues': [0, 3, 7]                  // Moll-Akkord (Blues basiert auf Moll)
};

// Interval Namen
const INTERVAL_NAMES = {
    0: 'Grundton',
    1: 'Minor Sekunde',
    2: 'Major Sekunde',
    3: 'Minor Terz',
    4: 'Major Terz',
    5: 'Quarte',
    6: 'Tritonus',
    7: 'Quinte',
    8: 'Minor Sexte',
    9: 'Major Sexte',
    10: 'Minor Septime',
    11: 'Major Septime'
};

class ScaleCalculator {
    constructor(rootNote, scaleType) {
        this.rootNote = rootNote;
        this.scaleType = scaleType;
        this.rootIndex = NOTES.indexOf(rootNote);
    }

    // Berechne alle Noten der Skala
    getScaleNotes() {
        const intervals = SCALE_INTERVALS[this.scaleType];
        return intervals.map(interval => {
            const noteIndex = (this.rootIndex + interval) % 12;
            return NOTES[noteIndex];
        });
    }

    // Berechne die Intervalle der Skala
    getScaleIntervals() {
        const intervals = SCALE_INTERVALS[this.scaleType];
        return intervals.map(interval => INTERVAL_NAMES[interval]);
    }

    // Berechne Arpeggio (Akkord-Töne)
    getArpeggios() {
        const intervals = ARPEGGIO_INTERVALS[this.scaleType];
        return intervals.map(interval => {
            const noteIndex = (this.rootIndex + interval) % 12;
            return NOTES[noteIndex];
        });
    }

    // Berechne Akkorde basierend auf der Skala
    getChords() {
        const scaleNotes = this.getScaleNotes();
        const scaleLength = scaleNotes.length;
        const chords = [];

        // Baue Akkorde auf den Skalentönen
        for (let i = 0; i < scaleLength; i++) {
            const root = scaleNotes[i];
            const third = scaleNotes[(i + 2) % scaleLength];
            const fifth = scaleNotes[(i + 4) % scaleLength];
            chords.push(`${root}-${third}-${fifth}`);
        }

        return chords;
    }
}

// Gitarren-Griffbrett Visualisierung
class GuitarFretboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.frets = 22;  // Standard E-Gitarre
        this.strings = ['E', 'B', 'G', 'D', 'A', 'E'];  // Von oben nach unten
        this.stringTuning = [40, 35, 31, 26, 21, 16];  // MIDI-Nummern für Standard-Tuning
    }

    // Berechne die Note auf einem bestimmten Bund und einer bestimmten Saite
    getNoteName(stringIndex, fretNumber) {
        const startNote = this.stringTuning[stringIndex];
        const noteIndex = (startNote + fretNumber) % 12;
        return NOTES[noteIndex];
    }

    // Zeichne das komplette Griffbrett
    render(scaleNotes, arpeggioNotes, rootNote) {
        this.container.innerHTML = '';
        const boardContainer = document.createElement('div');
        boardContainer.className = 'fret-board-container';

        // Fret-Nummern Reihe
        const fretNumberRow = document.createElement('div');
        fretNumberRow.className = 'string-row';
        fretNumberRow.style.marginBottom = '20px';
        
        const spacer = document.createElement('div');
        spacer.className = 'string-label';
        fretNumberRow.appendChild(spacer);

        for (let fret = 0; fret <= this.frets; fret++) {
            const fretLabel = document.createElement('div');
            fretLabel.className = 'fret';
            fretLabel.style.position = 'relative';
            fretLabel.style.marginTop = '25px';
            if (fret === 0) {
                fretLabel.innerHTML = '<span style="font-size: 0.9em; font-weight: bold; color: #D4A574;">Open</span>';
            } else {
                fretLabel.innerHTML = `<span class="fret-number" style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%);">${fret}</span>`;
            }
            fretNumberRow.appendChild(fretLabel);
        }
        boardContainer.appendChild(fretNumberRow);

        // Zeichne jede Saite
        for (let stringIndex = 0; stringIndex < this.strings.length; stringIndex++) {
            const stringRow = document.createElement('div');
            stringRow.className = 'string-row';

            // String-Label (E, B, G, D, A, E)
            const stringLabel = document.createElement('div');
            stringLabel.className = 'string-label';
            stringLabel.textContent = this.strings[stringIndex];
            stringRow.appendChild(stringLabel);

            // Zeichne jeden Bund
            for (let fret = 0; fret <= this.frets; fret++) {
                const fretElement = document.createElement('div');
                fretElement.className = 'fret';
                
                if (fret === 0) {
                    fretElement.classList.add('open');
                }

                const noteName = this.getNoteName(stringIndex, fret);
                
                // Überprüfe, ob diese Note in der Skala, dem Arpeggio oder der Grundnote ist
                if (noteName === rootNote) {
                    const dot = document.createElement('div');
                    dot.className = 'dot root';
                    dot.textContent = noteName;
                    dot.title = `${noteName} (Grundnote)`;
                    fretElement.appendChild(dot);
                    fretElement.style.boxShadow = '0 0 15px rgba(255, 107, 107, 0.6), inset 0 1px 3px rgba(0, 0, 0, 0.2)';
                } else if (arpeggioNotes.includes(noteName)) {
                    const dot = document.createElement('div');
                    dot.className = 'dot arpeggio';
                    dot.textContent = noteName;
                    dot.title = `${noteName} (Arpeggio)`;
                    fretElement.appendChild(dot);
                    fretElement.style.boxShadow = '0 0 12px rgba(79, 172, 254, 0.6), inset 0 1px 3px rgba(0, 0, 0, 0.2)';
                } else if (scaleNotes.includes(noteName)) {
                    const dot = document.createElement('div');
                    dot.className = 'dot scale';
                    dot.textContent = noteName;
                    dot.title = `${noteName} (Skalen-Ton)`;
                    fretElement.appendChild(dot);
                    fretElement.style.boxShadow = '0 0 12px rgba(102, 126, 234, 0.6), inset 0 1px 3px rgba(0, 0, 0, 0.2)';
                }

                stringRow.appendChild(fretElement);
            }

            boardContainer.appendChild(stringRow);
        }

        this.container.appendChild(boardContainer);
    }
}

// ===== HAUPTANWENDUNG =====

const rootNoteSelect = document.getElementById('rootNote');
const scaleTypeSelect = document.getElementById('scaleType');

const scaleNotesDisplay = document.getElementById('scaleNotes');
const scaleIntervalsDisplay = document.getElementById('scaleIntervals');
const arpeggiosDisplay = document.getElementById('arpeggios');
const chordsDisplay = document.getElementById('chords');

const fretboard = new GuitarFretboard('fretboard');

// Initiale Werte
let currentRootNote = 'C';
let currentScaleType = 'major';

// Render-Funktion
function updateDisplay() {
    const calculator = new ScaleCalculator(currentRootNote, currentScaleType);
    
    // Tonleiter
    const scaleNotes = calculator.getScaleNotes();
    scaleNotesDisplay.innerHTML = scaleNotes
        .map((note, index) => `<span class="note-badge">${index + 1}. ${note}</span>`)
        .join('');

    // Intervalle
    const intervals = calculator.getScaleIntervals();
    scaleIntervalsDisplay.innerHTML = intervals
        .map((interval, index) => `<span class="interval-badge">${interval}</span>`)
        .join('');

    // Arpeggios
    const arpeggios = calculator.getArpeggios();
    arpeggiosDisplay.innerHTML = arpeggios
        .map((note, index) => `<span class="arpeggio-badge">${index + 1}. ${note}</span>`)
        .join('');

    // Akkorde
    const chords = calculator.getChords();
    chordsDisplay.innerHTML = chords
        .map(chord => `<span class="chord-badge">${chord}</span>`)
        .join('');

    // Griffbrett
    fretboard.render(scaleNotes, arpeggios, currentRootNote);
}

// Event Listener
rootNoteSelect.addEventListener('change', (e) => {
    currentRootNote = e.target.value;
    updateDisplay();
});

scaleTypeSelect.addEventListener('change', (e) => {
    currentScaleType = e.target.value;
    updateDisplay();
});

// Initiale Anzeige
updateDisplay();

console.log('🎸 Gitarren Skalen Visualisierer geladen!');
