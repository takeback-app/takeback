import React from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router'

import Layout from '../../../../components/ui/Layout'

export default function RepresentativeDetails(): JSX.Element {
  const navigate = useNavigate()
  const { id } = useParams()

  return (
    <Layout goBackTitle="Representante" goBack={() => navigate(-1)}>
      <span>{id}</span>
    </Layout>
  )
}
