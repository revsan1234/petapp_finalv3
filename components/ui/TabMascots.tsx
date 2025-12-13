import React from 'react';
import type { Tab } from '../layout/TabNavigator';

interface TabMascotsProps {
    activeTab: Tab;
}

export const TabMascots: React.FC<TabMascotsProps> = () => {
  // This component is intentionally left empty to remove the floating characters
  // from the sides of the app, as per the user's request.
  // We accept the props to satisfy the parent component, but we don't use them here.
  return null;
};