import Bee from 'bee-queue';
import SubscriptionMail from '../app/jobs/SubscriptionMail';
import redisConfig from '../config/redis';

const jobs = [SubscriptionMail]; // vetor para todos os jobs que eu tiver

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    // para cada job é criada uma fila
    jobs.forEach(({ key, handle }) => {
      // key e handle são métodos do job subscriptionmail
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle); // o .on(failed) serve pra ouvir eventos de falhar no envio do email
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
