<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Console\Commands\CloseExpiredAuctions;

// Run our auction-closing command every minute.
// Laravel's scheduler calls this automatically when you have the cron job set up:
//   * * * * * php /path-to-project/artisan schedule:run >> /dev/null 2>&1
Schedule::command(CloseExpiredAuctions::class)->everyMinute();

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
