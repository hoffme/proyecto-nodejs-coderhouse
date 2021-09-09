import cluster from 'cluster';
import os from 'os';

import runner from './app';

import settings from './settings';

if (settings.cluster && cluster.isMaster) {
    const count_cpu = os.cpus().length;

    for (let i = 0; i < count_cpu; i++) {
        cluster.fork();
    }

    cluster.on('disconnect', (worker: any, code: any) => {
        console.log(`worker ${worker.process.pid} died with code ${code}`);
    })
} else {
    runner(settings);
}