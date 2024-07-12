import { Request, Response } from "express";
import * as cache from "memory-cache";
import { AppDataSource } from "../../../data-source";
import { encrypt } from "../../../helpers/encrypt";
import { isEmailValid } from "../../../helpers/utils";
import { User } from "../../../config/domain/User.entity";

export class UserController {
  static async signup(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const encryptedPassword = await encrypt.encryptpass(password);
      const user = new User();

      if (!name || !email || !password)
        return res
          .status(422)
          .json({ message: "Fields name, email and password required" });

      user.name = name;
      user.email = email;
      user.password = encryptedPassword;
      if (!isEmailValid(email))
        return res.status(422).json({ message: "Email not formatted" });

      const userRepository = AppDataSource.getRepository(User);
      await userRepository.save(user);
      const token = encrypt.generateToken({ id: user.id });

      return res
        .status(200)
        .json({ message: "User created successfully", token, user });
    } catch (error) {
      res.status(500).json({ message: "Error adding user" });
    }
  }

  static async getUsers(req: Request, res: Response) {
    const data = cache.get("data");
    if (data) {
      return res.status(200).json({
        data,
      });
    } else {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find();

      cache.put("data", users, 6000);
      return res.status(200).json({
        data: users,
      });
    }
  }

  static async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });
    user.name = name;
    user.email = email;
    await userRepository.save(user);
    res.status(200).json({ message: "updated", user });
  }

  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });
    await userRepository.remove(user);
    res.status(200).json({ message: "ok" });
  }
}
