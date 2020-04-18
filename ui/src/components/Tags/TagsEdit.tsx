import { Chip, MenuItem, Paper, TextField, Typography } from '@material-ui/core'
import classNames from 'classnames'
import React, { useEffect } from 'react'
import Select from 'react-select'
import { ITag } from 'types'

import useStyles from './TagsEdit.styles'

interface IProps {
  tags: ITag[]
  tagSuggestions: ITag[]
  edit: boolean
  tagsChanged: (tags: ITag[]) => void
}

interface IOption {
  value: any
  label: string
}

function NoOptionsMessage(props: any) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.styles.noOptionsMessage().classname}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

//@ts-ignore
function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />
}

function Control(props: any) {
  return (
    <TextField
      fullWidth={true}
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.styles.input().classname,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.textFieldProps}
    />
  )
}

function Option(props: any) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  )
}

function Placeholder(props: any) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.styles.placeholder().classname}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

function ValueContainer(props: any) {
  return <div className={props.selectProps.styles.valueContainer().classname}>{props.children}</div>
}

function MultiValue(props: any) {
  const onDelete = (event: any) => {
    event.preventDefault()
    event.stopPropagation()
    props.removeProps.onClick()
    props.removeProps.onMouseDown(event)
  }

  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(
        'chip_',
        '',
        { [props.selectProps.styles.chipFocused().classname]: props.isFocused },
        props.selectProps.styles.chip().classname
      )}
      onDelete={onDelete}
    />
  )
}

function Menu(props: any) {
  return (
    <Paper square={true} className={props.selectProps.styles.paper().classname} {...props.innerProps}>
      {props.children}
    </Paper>
  )
}

const components = {
  Option,
  Control,
  NoOptionsMessage,
  Placeholder,
  MultiValue,
  ValueContainer,
  Menu
}

const TagsEdit: React.FC<IProps> = props => {
  const classes = useStyles()

  const { edit, tags, tagsChanged, tagSuggestions } = props

  const convertLabelsToTags = (labelsToConvert: IOption[]) => {
    const convertedTags: ITag[] = []
    if (labelsToConvert) {
      for (const option of labelsToConvert) {
        convertedTags.push({
          id: option.value,
          name: option.label
        })
      }
    }
    return convertedTags
  }

  const convertTagsToLabels = (tagsToConvert: ITag[]): IOption[] => {
    const labels: IOption[] = []
    for (const tag of tagsToConvert) {
      labels.push({
        value: tag.id,
        label: tag.name
      })
    }
    return labels
  }

  useEffect(() => {
    if (edit) {
      //setAllTags(convertTagsToLabels(tagSuggestions))
    }
  }, [edit, tagSuggestions])

  const handleChange = (selected: IOption) => {
    //
    //setMulti(value)
    //setSelectedOption(selected)
    tagsChanged(convertLabelsToTags([selected]))
  }

  const tagChips = []
  const suggestedTags = convertTagsToLabels(tagSuggestions)

  const selectStyles = {
    input: (base: React.CSSProperties) => ({
      ...base,
      classname: classes.input
    }),
    valueContainer: (base: React.CSSProperties) => ({
      ...base,
      classname: classes.valueContainer
    }),
    chip: (base: React.CSSProperties) => ({
      ...base,
      classname: classes.chip
    }),
    chipFocused: (base: React.CSSProperties) => ({
      ...base,
      classname: classes.chipFocused
    }),
    noOptionsMessage: (base: React.CSSProperties) => ({
      ...base,
      classname: classes.noOptionsMessage
    }),
    placeholder: (base: React.CSSProperties) => ({
      ...base,
      classname: classes.placeholder
    }),
    paper: (base: React.CSSProperties) => ({
      ...base,
      classname: classes.paper
    })
  }

  for (const tag of tags) {
    tagChips.push(<Chip className={classes.tag} key={tag.id} label={tag.name} component="a" clickable={true} />)
    suggestedTags.push({
      value: tag.id,
      label: tag.name
    })
  }

  return (
    <div className={classes.root}>
      {/*<Select
        styles={selectStyles}
        options={tagSuggestions}
        components={components}
        value={selectedOption}
        onChange={handleChange}
        placeholder="Tags"
        isMulti={true}
      />*/}
    </div>
  )
}

export default TagsEdit
