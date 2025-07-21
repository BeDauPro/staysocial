const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ duyệt' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Đã duyệt' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Từ chối' },
      violation: { color: 'bg-red-100 text-red-800', text: 'Vi phạm' },
      active: { color: 'bg-green-100 text-green-800', text: 'Hoạt động' },
      banned: { color: 'bg-red-100 text-red-800', text: 'Bị cấm' },
    };
    return configs[status] || { color: 'bg-gray-100 text-gray-800', text: status };
  };

  const config = getStatusConfig(status);
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
      {config.text}
    </span>
  );
};
export default StatusBadge;