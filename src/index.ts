import 'dotenv/config'
import database from '@/config/databese'
import doubleBlaze from '@/blazeScrapping/doubleBlaze'
import crashBlaze from '@/blazeScrapping/crashBlaze'

database()
doubleBlaze()
crashBlaze()
