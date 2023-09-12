import {PredictService} from "../../app/services/predict/predict.service";

export function appInitializer(predictService: PredictService) {
  return () => predictService.createEntries();
}
