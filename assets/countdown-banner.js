/**
 *  @class
 *  @function CountdownTimer
 */
if (!customElements.get('countdown-timer')) {
  class CountdownTimer extends HTMLElement {
    constructor() {
      super();

      const timezone = this.dataset.timezone,
        date = this.dataset.date.split('-'),
        day = parseInt(date[0]),
        month = parseInt(date[1]),
        year = parseInt(date[2]);

      let time = this.dataset.time,
        tarhour, tarmin;

      if (time != null) {
        time = time.split(':');
        tarhour = parseInt(time[0]);
        tarmin = parseInt(time[1]);
      }



      // Set the date we're counting down to
      let date_string = month + '/' + day + '/' + year + ' ' + tarhour + ':' + tarmin + ' GMT' + timezone;
      // Time without timezone
      this.countDownDate = new Date(year, month - 1, day, tarhour, tarmin, 0, 0).getTime();

      // Time with timezone
      this.countDownDate = new Date(date_string).getTime();

    }

    convertDateForIos(date) {
      var arr = date.split(/[- :]/);
      date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
      return date;
    }
    connectedCallback() {
      let _this = this;
      const updateTime = function() {

        // Get todays date and time
        const now = new Date().getTime();

        // Find the distance between now an the count down date
        const distance = _this.countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
          _this.querySelector('.days .countdown-timer--column--number').innerHTML = 0;
          _this.querySelector('.hours .countdown-timer--column--number').innerHTML = 0;
          _this.querySelector('.minutes .countdown-timer--column--number').innerHTML = 0;
          _this.querySelector('.seconds .countdown-timer--column--number').innerHTML = 0;
        } else {
          requestAnimationFrame(updateTime);
          _this.querySelector('.days .countdown-timer--column--number').innerHTML = CountdownTimer.addZero(days);
          _this.querySelector('.hours .countdown-timer--column--number').innerHTML = CountdownTimer.addZero(hours);
          _this.querySelector('.minutes .countdown-timer--column--number').innerHTML = CountdownTimer.addZero(minutes);
          _this.querySelector('.seconds .countdown-timer--column--number').innerHTML = CountdownTimer.addZero(seconds);
        }


      };
      requestAnimationFrame(updateTime);
    }
    static addZero(x) {
      return (x < 10 && x >= 0) ? "0" + x : x;
    }
  }
  customElements.define('countdown-timer', CountdownTimer);
}