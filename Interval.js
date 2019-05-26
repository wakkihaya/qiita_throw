'use strict';


const  cron  = require('node-cron');
cron.schedule('* * */1 * * *',function () {
    get_sprint();
});
