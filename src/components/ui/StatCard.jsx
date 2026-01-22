import PropTypes from "prop-types";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = "bg-white", 
  textColor = "text-black" 
}) => {
  const displayValue = value ?? 0;
  
  return (
    <div className={`p-6 rounded-lg shadow-md ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-semibold ${textColor}`}>{title}</h3>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className={`text-2xl font-bold ${textColor}`}>{displayValue}</p>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.node,
  color: PropTypes.string,
  textColor: PropTypes.string
};

export default StatCard;