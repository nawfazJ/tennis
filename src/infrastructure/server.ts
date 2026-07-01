import { app } from './http/app';
import { getAppConfig } from './config/app.config';

const config = getAppConfig();

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
