export class PopulationAPI {
    constructor(data) {
      this.data = data;
    }

    getMinYear() {
        return this.data[0].year;
    }

    getMaxYear() {
        return this.data[this.data.length - 1].year;
    }
  }