--
-- Base de données : `db`
--

-- --------------------------------------------------------

--
-- Structure de la table `area`
--

CREATE TABLE `area` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `max_people` int(11) NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `location_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='working areas like canteen' ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Structure de la table `button`
--

CREATE TABLE `button` (
  `id` int(11) NOT NULL,
  `area` int(11) NOT NULL,
  `status` int(11) NOT NULL COMMENT 'in=1, out=-1',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `canteen_areas`
--

CREATE TABLE `canteen_areas` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `places_nb` int(11) NOT NULL,
  `location_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Structure de la table `canteen_areas_timeslots`
--

CREATE TABLE `canteen_areas_timeslots` (
  `id` int(11) NOT NULL,
  `timeslot_id` int(11) NOT NULL,
  `area_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Structure de la table `canteen_registration`
--

CREATE TABLE `canteen_registration` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `timeslot_id` int(11) NOT NULL,
  `day_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Structure de la table `canteen_timeslots`
--

CREATE TABLE `canteen_timeslots` (
  `id` int(11) NOT NULL,
  `timeslot` time NOT NULL,
  `places_nb` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `status` int(11) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Structure de la table `country`
--

CREATE TABLE `country` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `day`
--

CREATE TABLE `day` (
  `id` int(11) NOT NULL,
  `date` timestamp NOT NULL,
  `location_id` int(11) NOT NULL,
  `places_nb` int(11) NOT NULL,
  `parking_places_nb` int(11) NOT NULL,
  `flatware_nb` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `location`
--

CREATE TABLE `location` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `country_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `presence`
--

CREATE TABLE `presence` (
  `id` int(11) NOT NULL,
  `user` varchar(100) NOT NULL,
  `date_in` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_out` timestamp NULL DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '0 out / 1 : In',
  `area_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `quota`
--

CREATE TABLE `quota` (
  `id` int(11) NOT NULL,
  `places_nb` int(5) NOT NULL,
  `location_id` int(11) NOT NULL,
  `start_time` time NOT NULL DEFAULT '00:00:01',
  `end_time` time NOT NULL DEFAULT '23:59:59',
  `allowed_booking_nb` int(11) NOT NULL,
  `nurse_contact` text,
  `gs_contact` text,
  `parking_nb` int(11) NOT NULL,
  `booking_opening` int(11) NOT NULL,
  `booking_closure` int(11) NOT NULL,
  `fr_intro` text NOT NULL,
  `en_intro` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `register`
--

CREATE TABLE `register` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `day_id` int(11) NOT NULL,
  `arrival_date` timestamp NOT NULL,
  `departure_date` timestamp NOT NULL,
  `status` int(2) NOT NULL,
  `location_id` int(11) NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `parking` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `firstname` varchar(256) NOT NULL,
  `lastname` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `badge_number` bigint(20) NOT NULL,
  `token_notification` varchar(256) NOT NULL,
  `country` int(11) NOT NULL,
  `location` int(11) NOT NULL DEFAULT '1',
  `day_id` int(11) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `admin` int(11) NOT NULL DEFAULT '0',
  `admin_location` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `user_token`
--

CREATE TABLE `user_token` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `salt` varchar(256) NOT NULL,
  `token` varchar(256) NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `area`
--
ALTER TABLE `area`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `button`
--
ALTER TABLE `button`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `canteen_areas`
--
ALTER TABLE `canteen_areas`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `canteen_areas_timeslots`
--
ALTER TABLE `canteen_areas_timeslots`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `canteen_registration`
--
ALTER TABLE `canteen_registration`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `canteen_timeslots`
--
ALTER TABLE `canteen_timeslots`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `country`
--
ALTER TABLE `country`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `day`
--
ALTER TABLE `day`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `presence`
--
ALTER TABLE `presence`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `quota`
--
ALTER TABLE `quota`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `register`
--
ALTER TABLE `register`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user_token`
--
ALTER TABLE `user_token`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `area`
--
ALTER TABLE `area`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `button`
--
ALTER TABLE `button`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `canteen_areas`
--
ALTER TABLE `canteen_areas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `canteen_areas_timeslots`
--
ALTER TABLE `canteen_areas_timeslots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `canteen_registration`
--
ALTER TABLE `canteen_registration`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `canteen_timeslots`
--
ALTER TABLE `canteen_timeslots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `country`
--
ALTER TABLE `country`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `day`
--
ALTER TABLE `day`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `location`
--
ALTER TABLE `location`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `presence`
--
ALTER TABLE `presence`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `quota`
--
ALTER TABLE `quota`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `register`
--
ALTER TABLE `register`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user_token`
--
ALTER TABLE `user_token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;