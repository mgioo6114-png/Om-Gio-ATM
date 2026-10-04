import { SAMPLE_PROJECT_TECH_REVIEW } from '../constants/omGioData';
import { Project } from '../types';
import { convertToUnder11SecondsStoryboard } from './shortStoryboardAdapter';

export function getInitializedSampleProject(): Project {
  const baseProject = JSON.parse(JSON.stringify(SAMPLE_PROJECT_TECH_REVIEW)) as Project;
  return convertToUnder11SecondsStoryboard(baseProject);
}
