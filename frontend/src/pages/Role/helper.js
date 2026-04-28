export const groupPermissions = (permissions) => {
  const grouped = {};

  permissions.forEach((perm) => {
    if (!grouped[perm.module]) {
      grouped[perm.module] = [];
    }

    grouped[perm.module].push({
      id: perm._id,
      action: perm.action,
      label: `${capitalize(perm.action)} ${capitalize(perm.module)}`,
    });
  });

  return grouped;
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);