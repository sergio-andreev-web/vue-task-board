import OverviewView from './OverviewView.vue';
import ProjectsView from './ProjectsView.vue';
import TeamsView from './TeamsView.vue';
import BoardsView from './BoardsView.vue';
import MilestonesView from './MilestonesView.vue';
import SprintsView from './SprintsView.vue';
import ReleasesView from './ReleasesView.vue';
import GoalsView from './GoalsView.vue';
import LabelsView from './LabelsView.vue';
import CommentsView from './CommentsView.vue';
import AttachmentsView from './AttachmentsView.vue';
import TimeEntriesView from './TimeEntriesView.vue';
import ExpensesView from './ExpensesView.vue';
import SchedulesView from './SchedulesView.vue';
import RemindersView from './RemindersView.vue';
import NotificationsView from './NotificationsView.vue';
import ActivitiesView from './ActivitiesView.vue';
import WebhooksView from './WebhooksView.vue';
import IntegrationsView from './IntegrationsView.vue';
import TemplatesView from './TemplatesView.vue';
import WorkflowsView from './WorkflowsView.vue';
import DashboardsView from './DashboardsView.vue';
import WidgetsView from './WidgetsView.vue';
import FoldersView from './FoldersView.vue';
import LinksView from './LinksView.vue';
import ContactsView from './ContactsView.vue';
import DependenciesView from './DependenciesView.vue';
import SavedViewsView from './SavedViewsView.vue';
import WorkspacesView from './WorkspacesView.vue';
import InvitationsView from './InvitationsView.vue';
import AuditLogsView from './AuditLogsView.vue';

export const views = {
  overview: { label: 'Overview', component: OverviewView },
  projects: { label: 'Projects', component: ProjectsView },
  teams: { label: 'Teams', component: TeamsView },
  boards: { label: 'Boards', component: BoardsView },
  milestones: { label: 'Milestones', component: MilestonesView },
  sprints: { label: 'Sprints', component: SprintsView },
  releases: { label: 'Releases', component: ReleasesView },
  goals: { label: 'Goals', component: GoalsView },
  labels: { label: 'Labels', component: LabelsView },
  comments: { label: 'Comments', component: CommentsView },
  attachments: { label: 'Attachments', component: AttachmentsView },
  timeEntries: { label: 'TimeEntries', component: TimeEntriesView },
  expenses: { label: 'Expenses', component: ExpensesView },
  schedules: { label: 'Schedules', component: SchedulesView },
  reminders: { label: 'Reminders', component: RemindersView },
  notifications: { label: 'Notifications', component: NotificationsView },
  activities: { label: 'Activities', component: ActivitiesView },
  webhooks: { label: 'Webhooks', component: WebhooksView },
  integrations: { label: 'Integrations', component: IntegrationsView },
  templates: { label: 'Templates', component: TemplatesView },
  workflows: { label: 'Workflows', component: WorkflowsView },
  dashboards: { label: 'Dashboards', component: DashboardsView },
  widgets: { label: 'Widgets', component: WidgetsView },
  folders: { label: 'Folders', component: FoldersView },
  links: { label: 'Links', component: LinksView },
  contacts: { label: 'Contacts', component: ContactsView },
  dependencies: { label: 'Dependencies', component: DependenciesView },
  savedViews: { label: 'SavedViews', component: SavedViewsView },
  workspaces: { label: 'Workspaces', component: WorkspacesView },
  invitations: { label: 'Invitations', component: InvitationsView },
  auditLogs: { label: 'AuditLogs', component: AuditLogsView }
};
