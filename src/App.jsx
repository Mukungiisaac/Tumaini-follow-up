import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';

import DashboardView from './views/DashboardView';
import ChildrenDirectoryView from './views/ChildrenDirectoryView';
import ChildProfileView from './views/ChildProfileView';
import ProgressTrackingView from './views/ProgressTrackingView';
import ObservationsView from './views/ObservationsView';
import GoalsView from './views/GoalsView';
import ActivitiesView from './views/ActivitiesView';
import ComputerCurriculumView from './views/ComputerCurriculumView';
import BibleDiscipleshipView from './views/BibleDiscipleshipView';
import MathScienceView from './views/MathScienceView';
import MusicArtsView from './views/MusicArtsView';
import MentorshipView from './views/MentorshipView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardView />} />
          <Route path="children" element={<ChildrenDirectoryView />} />
          <Route path="children/:id" element={<ChildProfileView />} />
          <Route path="progress" element={<ProgressTrackingView />} />
          <Route path="observations" element={<ObservationsView />} />
          <Route path="goals" element={<GoalsView />} />
          <Route path="activities" element={<ActivitiesView />} />
          
          {/* Curriculum Routes */}
          <Route path="curriculum/computer" element={<ComputerCurriculumView />} />
          <Route path="curriculum/bible" element={<BibleDiscipleshipView />} />
          <Route path="curriculum/math-science" element={<MathScienceView />} />
          <Route path="curriculum/music-arts" element={<MusicArtsView />} />
          
          {/* Management Routes */}
          <Route path="mentorship" element={<MentorshipView />} />
          <Route path="reports" element={<ReportsView />} />
          <Route path="settings" element={<SettingsView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
