import mongoose from 'mongoose';
import settings from './config/settings';
import { serverHTTP } from './app';

mongoose.plugin(require('@meanie/mongoose-to-json'));

const start = async () => {
  try {

    mongoose.connect(settings.database.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      maxPoolSize: 100
    });

  } catch (e) {
    console.error(e);

  } finally {
    serverHTTP.listen(settings.port, () => console.log('Server HTTP listening on port ' + settings.port));
  }
}

start();
