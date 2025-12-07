import { h } from 'preact';
import { useState } from 'preact/hooks';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export type GameOptions = {
  amount: number;
  category: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'any';
  type: 'boolean' | 'multiple' | 'any';
};

type Props = {
  onOptionsChange: (options: GameOptions) => void;
  onRestart: () => void;
};

export function OptionsPanel({ onOptionsChange, onRestart }: Props) {
  const [amount, setAmount] = useState(3);
  const [category, setCategory] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'any'>('any');
  const [typeBoolean, setTypeBoolean] = useState(false);
  const [typeMultiple, setTypeMultiple] = useState(false);

  function handleAmountChange(_: any, value: number | number[]) {
    const newAmount = Array.isArray(value) ? value[0] : value;
    setAmount(newAmount);
    updateOptions({ amount: newAmount });
  }

  function handleCategoryChange(e: any) {
    const newCategory = parseInt(e.target.value, 10);
    setCategory(newCategory);
    updateOptions({ category: newCategory });
  }

  function handleDifficultyChange(e: any) {
    const newDifficulty = e.target.value as 'easy' | 'medium' | 'hard' | 'any';
    setDifficulty(newDifficulty);
    updateOptions({ difficulty: newDifficulty });
  }

  function handleTypeChange(typeKey: 'boolean' | 'multiple') {
    if (typeKey === 'boolean') {
      setTypeBoolean(!typeBoolean);
    } else {
      setTypeMultiple(!typeMultiple);
    }
  }

  function getTypeValue(): 'boolean' | 'multiple' | 'any' {
    if (typeBoolean && typeMultiple) return 'any';
    if (typeBoolean) return 'boolean';
    if (typeMultiple) return 'multiple';
    return 'any';
  }

  function updateOptions(partial: Partial<GameOptions>) {
    const options: GameOptions = {
      amount,
      category,
      difficulty,
      type: getTypeValue(),
      ...partial,
    };
    onOptionsChange(options);
  }

  function handleRestart() {
    onRestart();
  }

  const categoryOptions = [
    { id: 0, name: 'Any Category' },
    { id: 9, name: 'General Knowledge' },
    { id: 10, name: 'Entertainment: Books' },
    { id: 11, name: 'Entertainment: Film' },
    { id: 12, name: 'Entertainment: Music' },
    { id: 13, name: 'Entertainment: Musicals & Theatres' },
    { id: 14, name: 'Entertainment: Television' },
    { id: 15, name: 'Entertainment: Video Games' },
    { id: 16, name: 'Entertainment: Board Games' },
    { id: 17, name: 'Science & Nature' },
    { id: 18, name: 'Science: Computers' },
    { id: 19, name: 'Science: Mathematics' },
    { id: 20, name: 'Mythology' },
    { id: 21, name: 'Sports' },
    { id: 22, name: 'Geography' },
    { id: 23, name: 'History' },
    { id: 24, name: 'Politics' },
    { id: 25, name: 'Art' },
    { id: 26, name: 'Celebrities' },
    { id: 27, name: 'Animals' },
    { id: 28, name: 'Vehicles' },
    { id: 29, name: 'Entertainment: Comics' },
    { id: 30, name: 'Science: Gadgets' },
    { id: 31, name: 'Entertainment: Japanese Anime & Manga' },
    { id: 32, name: 'Entertainment: Cartoon & Animations' },
  ];

  return (
    <Stack spacing={4} sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text)' }}>
        Game Options
      </Typography>

      {/* Amount Slider */}
      <FormControl fullWidth>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--text)' }}>
          Number of Questions: {amount}
        </Typography>
        <Slider
          min={3}
          max={30}
          value={amount}
          onChange={handleAmountChange}
          marks={[
            { value: 3, label: '3' },
            { value: 30, label: '30' },
          ]}
          valueLabelDisplay="auto"
          sx={{
            color: 'var(--accent)',
            '& .MuiSlider-markLabel': {
              color: 'var(--text)',
            },
            '& .MuiSlider-valueLabelLabel': {
              color: 'var(--accent-text)',
            },
          }}
        />
      </FormControl>

      {/* Category Dropdown */}
      <FormControl fullWidth>
        <InputLabel sx={{ color: 'var(--text)' }}>Category</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={handleCategoryChange}
          sx={{
            backgroundColor: 'var(--btn-bg)',
            color: 'var(--btn-text)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--btn-border)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--btn-border)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--accent)',
            },
          }}
        >
          {categoryOptions.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Difficulty Dropdown */}
      <FormControl fullWidth>
        <InputLabel sx={{ color: 'var(--text)' }}>Difficulty</InputLabel>
        <Select
          value={difficulty}
          label="Difficulty"
          onChange={handleDifficultyChange}
          sx={{
            backgroundColor: 'var(--btn-bg)',
            color: 'var(--btn-text)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--btn-border)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--btn-border)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--accent)',
            },
          }}
        >
          <MenuItem value="any">Any Difficulty</MenuItem>
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
        </Select>
      </FormControl>

      {/* Type Checkboxes */}
      <FormControl component="fieldset">
        <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'var(--text)' }}>
          Question Type
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={typeBoolean}
                onChange={() => handleTypeChange('boolean')}
                sx={{
                  color: 'var(--text)',
                  '&.Mui-checked': {
                    color: 'var(--accent)',
                  },
                }}
              />
            }
            label={<span style={{ color: 'var(--text)' }}>True/False</span>}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={typeMultiple}
                onChange={() => handleTypeChange('multiple')}
                sx={{
                  color: 'var(--text)',
                  '&.Mui-checked': {
                    color: 'var(--accent)',
                  },
                }}
              />
            }
            label={<span style={{ color: 'var(--text)' }}>Multiple Choice</span>}
          />
        </FormGroup>
      </FormControl>

      {/* Restart Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={handleRestart}
        sx={{
          backgroundColor: 'var(--accent)',
          color: 'var(--accent-text)',
          fontWeight: 700,
          py: 1.5,
          mt: 1,
          '&:hover': {
            backgroundColor: 'color-mix(in srgb, var(--accent) 85%, black 15%)',
          },
        }}
      >
        Restart Game
      </Button>
    </Stack>
  );
}