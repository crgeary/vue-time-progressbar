Vue.component('crgeary-time-progressbar', {

    props: {
        starts_at: { required: true, type: String },
        ends_at: { required: true, type: String },
        minutes: { required: true, type: Number, default: 0 }
    },

    template: `
        <div class="timer">
            <span>{{ endsAt.format('HH:mm') }}</span>
            <div class="bar" v-bind:style="barCssStyles">
                <span>{{ minutesPercentage.toFixed(1) }}%</span>
            </div>
            <div class="rules">
                <span v-for="n in segments"></span>
            </div>
            <div class="position" v-bind:style="{ bottom: currentTimePercentage + '%' }"></div>
            <span>{{ startsAt.format('HH:mm') }}</span>
        </div>
    `,

    data: function () {
        return {
            differenceInMinutes: 0,
            segmentIntervalsInMinutes: 30,
            differencePercentage: 0  
        }
    },

    mounted: function () {
        setTimeout(this.setDifferenceInMinutes, 250);
    },

    computed: {
        startsAt: function () {
            return moment(this.starts_at, 'HH:mm');
        },
        endsAt: function () {
            let minutes = moment(this.ends_at, 'HH:mm').diff(moment(this.starts_at, 'HH:mm'), 'minutes');
            if (this.differenceInMinutes > minutes) {
                return this.ceilTimeToNearestInterval(this.getCurrentTime()); 
            }
            return moment(this.ends_at, 'HH:mm');
        },
        totalMinutes: function () {
            return this.endsAt.diff(this.startsAt, 'minutes');
        },
        segments: function () {
            return this.countNeededSegements(this.segmentIntervalsInMinutes);
        },
        minutesPercentage: function () {
            return (this.minutes/this.totalMinutes) * 100;
        },
        currentTimePercentage: function () {
            return (this.differenceInMinutes/this.totalMinutes) * 100;
        },
        untrackedPercentage: function () {
            return (this.minutesPercentage/this.currentTimePercentage) * 100;
        },
        barCssStyles: function () {
            return {
                 height: this.minutesPercentage + '%',
                 backgroundColor: 'hsl(' + this.barCssBackgroundHslPercentage(this.untrackedPercentage) + ', 93%, 37%)'
            };
        }
    },

    methods: {
        countNeededSegements: function (interval) {
            return Math.ceil(this.totalMinutes/interval) + 1;
        },
        setDifferenceInMinutes: function () {
            this.differenceInMinutes = this.getCurrentTime().diff(this.startsAt, 'minutes');
            setTimeout(this.setDifferenceInMinutes, 5000);
        },
        getCurrentTime: function () {
            return moment();
        },
        ceilTimeToNearestInterval: function (time) {
            return moment(time).add('minutes', (this.segmentIntervalsInMinutes - time.minute() % this.segmentIntervalsInMinutes)); 
        },
        barCssBackgroundHslPercentage: function (percentage) {
            return percentage <= 100 ? percentage/(120/100) : 83.33;
        }
    }

});