type TTagColor =
  | 'blue'
  | 'dark'
  | 'red'
  | 'green'
  | 'yellow'
  | 'indigo'
  | 'purple'
  | 'pink';
const Tag = ({ text, color }: { text: string; color: TTagColor }) => {
  return (
    <span
      style={{
        backgroundColor: color === 'blue' ? '#0044ba' : color,
        width: '80px',
        display: 'block',
        textAlign: 'center',
      }}
      className={`text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded`}
    >
      {text}
    </span>
  );
};
export default Tag;
export type { TTagColor };
