class GameAudio {
  constructor() {
    this.cache = {}; // store multiple sounds by name
    this.context = new AudioContext();

    // gains are the controls/settings (Volume,etc) associated to the played sound node.
    this.gains = {
      background: this.context.createGain(),
      effects: this.context.createGain(),
    };

    // connecting to output (speakers)
    this.gains.background.connect(this.context.destination);
    this.gains.effects.connect(this.context.destination);

    // Keep track of background music source for looping
    this.backgroundSource = null;
  }

  async load({ name, path }) {
    // fetch the file
    const file = await fetch(path);

    // convert to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // decode to playable AudioBuffer
    const decodedBuffer = await this.context.decodeAudioData(arrayBuffer);

    // cache it for later use
    this.cache[name] = decodedBuffer;
  }

  play(name, type = "effects", loop = false) {
    const buffer = this.cache[name];
    if (!buffer) return;

    // creates the src
    const source = this.context.createBufferSource();

    // loads the src
    source.buffer = buffer;

    // loop
    source.loop = loop;

    // connect with the speaker/output
    source.connect(this.gains[type]);

    // plays the sound
    source.start(0);

    if (type === "background") {
      // store reference so we can stop or change later
      this.backgroundSource = source;
    }
  }

  setVolume(type, value) {
    if (this.gains[type] && value >= 0 && value <= 1) {
      this.gains[type].gain.value = value; // 0.0 - 1.0
      return;
    }
    throw new Error(
      `Check Audio class in your project where : setVolume value:${value} ${type}`
    );
  }

  stopBackgroundSound() {
    if (!this.backgroundSource) return;
    this.backgroundSource.stop();
    this.backgroundSource = null;
  }
}

export default GameAudio;
