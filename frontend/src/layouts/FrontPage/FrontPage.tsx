import { ImageDTO, ItemDTO } from '@portalbase/application'
import { Box, Skeleton, Typography, TypographyProps, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAtom } from 'infrastructure/dataAccess/atoms'
import { useAtom } from 'jotai'
import ImageRepository from 'infrastructure/repositories/ImageRepository'
import { makeStyles } from 'tss-react/mui'
import { unstable_batchedUpdates } from 'react-dom'

const imageRepository = new ImageRepository()

const FrontPageHeader: React.FC<TypographyProps> = ({ sx, ...props }) => {
  return (
    <Typography
      variant="h6"
      sx={{
        ...{
          textDecoration: 'underline',
          textUnderlineOffset: '0.45em',
          textDecorationThickness: '2px',
          borderBottom: (theme) => `3px solid ${theme.palette.primary.dark}`,
          width: '90%',
          whiteSpace: 'nowrap'
        },
        ...sx
      }}
      {...props}
    />
  )
}

export const useStyles = makeStyles()((theme) => ({
  itemCard: {
    '&&': {
      fontSize: '12px',
      '&:hover': {
        '& > .stats-background': {
          backgroundBlendMode: 'multiply',
          boxShadow: '0.1rem 0 0.2rem #89857f,-0.1rem 0 0.2rem #89857f'
        },
        opacity: '0.9',
        cursor: 'pointer'
      }
    },
    '&&&': {
      img: {
        minWidth: '240px'
      }
    }
  }
}))

const FrontPage: React.FC = () => {
  const [loadingImage, setLoadingImage] = useState(true)
  const [image, setImage] = useState<ImageDTO | null | undefined>(null)
  const navigate = useNavigate()
  const [authState] = useAtom(authAtom)
  const { classes } = useStyles()

  const theme = useTheme()
  const isLarge = useMediaQuery(theme.breakpoints.up('xl'))

  const imageRequestControllerRef = useRef<AbortController | null>(null)
  const pageStatsRequestControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      pageStatsRequestControllerRef?.current?.abort()
      imageRequestControllerRef?.current?.abort()
    }
  }, [])

  const goToItem = (itemId?: string) => {
    if (itemId) {
      navigate(`/card/item/${itemId}`)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 100%',
        minHeight: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    ></Box>
  )
}

export default FrontPage
