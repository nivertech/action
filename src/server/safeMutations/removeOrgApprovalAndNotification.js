import getRethink from 'server/database/rethinkDriver';
import {REQUEST_NEW_USER} from 'universal/utils/constants';

const removeOrgApprovalAndNotification = async (orgId, maybeEmails) => {
  const emails = Array.isArray(maybeEmails) ? maybeEmails : [maybeEmails];
  const r = getRethink();
  const {removedNotifications} = await r({
    removedApproval: r.table('OrgApproval')
      .getAll(r.args(emails), {index: 'email'})
      .filter({orgId})
      .delete(),
    removedNotifications: r.table('Notification')
      .getAll(orgId, {index: 'orgId'})
      .filter({
        type: REQUEST_NEW_USER
      })
      .filter((notification) => {
        return r.expr(emails).contains(notification('inviteeEmail'));
      })
      // get the inviterName
      .delete({returnChanges: true})('changes')
      .map((change) => change('old_val'))
      .default([])
  });
  const notificationsToClear = {};
  removedNotifications.forEach((removedNotification) => {
    removedNotification.userIds.forEach((userId) => {
      notificationsToClear[userId] = notificationsToClear[userId] || [];
      notificationsToClear[userId].push(removedNotification.id);
    });
  });
  return notificationsToClear;
};

export default removeOrgApprovalAndNotification;
