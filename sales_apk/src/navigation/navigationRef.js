import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';

export const rootNavigationRef = createNavigationContainerRef();

export function resetToWelcome() {
  if (!rootNavigationRef.isReady()) return;
  rootNavigationRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    })
  );
}
