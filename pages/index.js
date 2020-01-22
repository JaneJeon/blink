import React from 'react'
import Head from 'next/head'
import URLForm from '../components/url-form'

const Home = () => (
  <div>
    <Head>
      <title>Home</title>
      <link rel="icon" href="/static/favicon.ico" importance="low" />
    </Head>
    <URLForm />
  </div>
)

export default Home
